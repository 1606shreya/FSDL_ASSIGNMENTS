import { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useTranslation = () => {
    const { language, changeLanguage, translate } = useContext(LanguageContext);

    // A helper to translate text and return state. 
    // Since translation is async, React components need a way to render it optimally.
    // For single string translations:
    const t = (text, defaultText = '') => {
        const [translatedText, setTranslatedText] = useState(defaultText || text);

        useEffect(() => {
            let isMounted = true;

            if (language === 'en' || !text) {
                setTranslatedText(text);
                return;
            }

            const fetchTranslation = async () => {
                const result = await translate(text);
                if (isMounted) {
                    setTranslatedText(result);
                }
            };

            fetchTranslation();

            return () => {
                isMounted = false;
            };
        }, [text, language, translate]);

        return translatedText;
    };

    return { t, language, changeLanguage, translate };
};
