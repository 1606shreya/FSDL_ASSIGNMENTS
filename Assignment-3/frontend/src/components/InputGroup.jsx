import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './InputGroup.module.css';

const InputGroup = ({ label, type = 'text', name, value, onChange, error, placeholder, icon: Icon }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.inputGroup}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputWrapper}>
                {Icon && <Icon className={styles.icon} size={20} />}
                <input
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${styles.input} ${error ? styles.errorInput : ''} ${Icon ? styles.inputWithIcon : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default InputGroup;
