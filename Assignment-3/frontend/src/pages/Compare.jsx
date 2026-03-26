import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { medicines } from '../data/mockData';
import styles from './Compare.module.css';

const Compare = () => {
    const { t } = useTranslation();
    // Taking first two medicines for demo comparison
    const med1 = medicines[0];
    const med2 = medicines[3];

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>{t('Compare Medicines')}</h1>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>{t('Feature')}</th>
                            <th className={styles.th}>{med1.name} ({t('Brand')})</th>
                            <th className={styles.thGeneric}>{med2.name} ({t('Generic Alternative')})</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.tdLabel}>{t('Manufacturer')}</td>
                            <td className={styles.td}>{med1.manufacturer}</td>
                            <td className={styles.td}>{med2.manufacturer}</td>
                        </tr>
                        <tr>
                            <td className={styles.tdLabel}>{t('Price')}</td>
                            <td className={styles.tdPrice}>₹{med1.brandPrice}</td>
                            <td className={styles.tdGenericPrice}>₹{med2.genericPrice}</td>
                        </tr>
                        <tr>
                            <td className={styles.tdLabel}>{t('Salt Composition')}</td>
                            <td className={styles.td}>{med1.salt}</td>
                            <td className={styles.td}>{med2.salt}</td>
                        </tr>
                        <tr>
                            <td className={styles.tdLabel}>{t('Description')}</td>
                            <td className={styles.td}>{med1.description}</td>
                            <td className={styles.td}>{med2.description}</td>
                        </tr>
                        <tr>
                            <td className={styles.tdLabel}>{t('Rating')}</td>
                            <td className={styles.td}>
                                <span className={styles.rating}>{med1.rating} ★</span>
                            </td>
                            <td className={styles.td}>
                                <span className={styles.rating}>{med2.rating} ★</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Compare;
