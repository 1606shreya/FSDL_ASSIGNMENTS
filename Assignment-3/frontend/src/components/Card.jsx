import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, title, subtitle }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {children}
        </div>
    );
};

export default Card;
