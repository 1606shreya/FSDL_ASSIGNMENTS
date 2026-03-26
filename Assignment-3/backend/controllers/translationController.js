import axios from 'axios';

const MODEL_MAP = {
    'hi': 'Helsinki-NLP/opus-mt-en-hi',
    'fr': 'Helsinki-NLP/opus-mt-en-fr',
    'de': 'Helsinki-NLP/opus-mt-en-de',
    'mr': 'Helsinki-NLP/opus-mt-en-mr' // Assuming standard opus-mt identifier
};

export const translateText = async (req, res) => {
    try {
        const { text, targetLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ message: 'Text and targetLang are required' });
        }

        if (targetLang === 'en') {
            return res.json({ translatedText: text });
        }

        const modelId = MODEL_MAP[targetLang];
        if (!modelId) {
            console.warn(`Unsupported target language: ${targetLang}, falling back to English`);
            return res.json({ translatedText: text });
        }

        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (!apiKey) {
            console.warn('HUGGINGFACE_API_KEY is not defined in .env! Returning original text.');
            return res.json({ translatedText: text });
        }

        const url = `https://router.huggingface.co/hf-inference/models/${modelId}`;

        const response = await axios.post(
            url,
            { inputs: text },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].translation_text) {
            return res.json({ translatedText: response.data[0].translation_text });
        }

        console.warn('Unexpected response structure from Hugging Face API:', response.data);
        res.json({ translatedText: text });

    } catch (error) {
        console.error('Hugging Face Translation Error:', error?.response?.data || error.message);

        // Handle model loading state gracefully (HF often returns 503 while loading model)
        if (error?.response?.status === 503) {
            console.log(`Model is loading. Returning original text as fallback.`);
        }
        res.json({ translatedText: req.body.text || '' });
    }
};
