import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, type = 'button', onClick, disabled, variant = 'primary' }) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
