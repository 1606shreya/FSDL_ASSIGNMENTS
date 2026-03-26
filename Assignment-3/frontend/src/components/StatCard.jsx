import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className={styles.card} style={{ borderLeft: `4px solid ${color}` }}>
            <div className={styles.content}>
                <span className={styles.title}>{title}</span>
                <span className={styles.value}>{value}</span>
            </div>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
        </div>
    );
};

export default StatCard;
