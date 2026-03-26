import React from 'react';
import { TrendingDown, ArrowRight, Bookmark } from 'lucide-react';
import Button from './Button';
import { useTranslation } from '../hooks/useTranslation';
import styles from './MedicineCard.module.css';

const MedicineCard = ({ medicine, onSave }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.brandName}>{medicine.name}</h3>
                    <p className={styles.manufacturer}>{medicine.manufacturer}</p>
                </div>
                <div className={styles.badge}>
                    <TrendingDown size={14} />
                    <span>{medicine.savedPercentage}% {t('Saved')}</span>
                </div>
            </div>

            <div className={styles.comparison}>
                <div className={styles.priceBox}>
                    <span className={styles.label}>{t('Brand Price')}</span>
                    <span className={styles.price}>₹{medicine.brandPrice}</span>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.priceBox}>
                    <span className={styles.label}>{t('Generic Price')}</span>
                    <span className={styles.genericPrice}>₹{medicine.genericPrice}</span>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>{t('Generic Name')}:</span>
                    <span className={styles.detailValue}>{medicine.genericName}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.saveButton} onClick={() => onSave(medicine)}>
                    <Bookmark size={20} />
                </button>
                <Button variant="primary">
                    {t('View Details')} <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                </Button>
            </div>
        </div>
    );
};

export default MedicineCard;
