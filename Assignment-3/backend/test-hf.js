import axios from 'axios';
import fs from 'fs';

async function testHF() {
    try {
        const response = await axios.post(
            'https://router.huggingface.co/hf-inference/models/Helsinki-NLP/opus-mt-en-hi',
            { inputs: "Hello" },
            {
                headers: {
                    // Make sure to use the new token
                    'Authorization': `Bearer ${process.env.HF_TOKEN || 'YOUR_HF_TOKEN_HERE'}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Success:", JSON.stringify(response.data, null, 2));
    } catch (e) {
        fs.writeFileSync('hf-error-3.txt', e.response?.data?.error || "Unknown error");
        console.log("Error saved to hf-error-3.txt");
    }
}
testHF();
