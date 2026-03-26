import React from 'react';
import { Pill, Activity } from 'lucide-react';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className={styles.container}>
            <div className={styles.illustrationSection}>
                <div className={styles.brand}>
                    <div className={styles.logoWrapper}>
                        <Pill size={32} className={styles.logoIcon} />
                    </div>
                    <h1 className={styles.brandName}>Generic Medicine Finder</h1>
                </div>
                <div className={styles.illustrationContent}>
                    <Activity size={120} className={styles.heroIcon} />
                    <h2 className={styles.heroTitle}>Affordable Healthcare for Everyone</h2>
                    <p className={styles.heroSubtitle}>
                        Find trusted generic alternatives to branded medicines. Save money without compromising on quality.
                    </p>
                </div>
                <div className={styles.overlay}></div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.mobileBrand}>
                        <Pill size={24} className={styles.logoIcon} />
                        <span className={styles.brandNameMobile}>Generic Med Finder</span>
                    </div>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{title}</h2>
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
