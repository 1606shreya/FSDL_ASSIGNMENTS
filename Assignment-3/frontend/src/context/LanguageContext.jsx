import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('app_language') || 'en';
    });

    // Simple cache for translations to avoid redundant API calls
    const [translationCache, setTranslationCache] = useState({});

    useEffect(() => {
        localStorage.setItem('app_language', language);
    }, [language]);

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    const translate = useCallback(async (text) => {
        if (!text) return '';
        if (language === 'en') return text;

        const cacheKey = `${language}_${text}`;
        if (translationCache[cacheKey]) {
            return translationCache[cacheKey];
        }

        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    targetLang: language
                })
            });

            if (res.ok) {
                const data = await res.json();
                const translated = data.translatedText || text;

                // Update cache
                setTranslationCache(prev => ({
                    ...prev,
                    [cacheKey]: translated
                }));

                return translated;
            } else {
                return text; // fallback
            }
        } catch (error) {
            console.error('Translation error:', error);
            return text; // fallback
        }
    }, [language, translationCache]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};
