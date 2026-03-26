import React, { useRef, useState, useEffect } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import styles from './LanguageSwitcher.module.css';

const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' }
];

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (code) => {
        changeLanguage(code);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button className={styles.triggerButton} onClick={toggleDropdown} aria-label="Select Language">
                <Languages size={20} className={styles.icon} />
                <span className={styles.langName}>{currentLang.name.split(' ')[0]}</span>
                <ChevronDown size={16} className={styles.iconSmall} />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            className={`${styles.item} ${language === lang.code ? styles.active : ''}`}
                            onClick={() => handleSelect(lang.code)}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
