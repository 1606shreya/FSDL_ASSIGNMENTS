import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const { t } = useTranslation();
    const [medicines, setMedicines] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('medicines');
    const [form, setForm] = useState({
        brandName: '', genericName: '', strength: '', form: '', price: ''
    });

    useEffect(() => {
        if (activeTab === 'medicines') fetchMedicines();
        if (activeTab === 'logs') fetchAuditLogs();
    }, [activeTab]);

    const fetchMedicines = async () => {
        try {
            const res = await fetch('/api/admin/medicines');
            const data = await res.json();
            setMedicines(data);
        } catch (error) {
            console.error("Error fetching medicines", error);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const res = await fetch('/api/admin/audit-logs');
            const data = await res.json();
            setAuditLogs(data);
        } catch (error) {
            console.error("Error fetching logs", error);
        }
    };

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/medicines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    contraindications: [], allergies: [], chronicDiseaseWarnings: []
                })
            });
            if (res.ok) {
                alert(t("Medicine added!"));
                setForm({ brandName: '', genericName: '', strength: '', form: '', price: '' });
                fetchMedicines();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm(t("Are you sure?"))) return;
        try {
            const res = await fetch(`/api/admin/medicines/${id}`, { method: 'DELETE' });
            if (res.ok) fetchMedicines();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.adminContainer}>
            <h2>{t('Admin Dashboard')}</h2>
            <div className={styles.tabs}>
                <button
                    className={activeTab === 'medicines' ? styles.active : ''}
                    onClick={() => setActiveTab('medicines')}
                >{t('Medicines')}</button>
                <button
                    className={activeTab === 'logs' ? styles.active : ''}
                    onClick={() => setActiveTab('logs')}
                >{t('Audit Logs')}</button>
            </div>

            {activeTab === 'medicines' && (
                <div className={styles.section}>
                    <h3>{t('Add Medicine')}</h3>
                    <form className={styles.addForm} onSubmit={handleAddMedicine}>
                        <input type="text" placeholder={t("Brand Name")} value={form.brandName} onChange={e => setForm({ ...form, brandName: e.target.value })} required />
                        <input type="text" placeholder={t("Generic Name")} value={form.genericName} onChange={e => setForm({ ...form, genericName: e.target.value })} required />
                        <input type="text" placeholder={t("Strength")} value={form.strength} onChange={e => setForm({ ...form, strength: e.target.value })} required />
                        <input type="text" placeholder={t("Form (e.g., Tablet)")} value={form.form} onChange={e => setForm({ ...form, form: e.target.value })} required />
                        <input type="number" placeholder={t("Price")} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        <button type="submit">{t('Add Medicine')}</button>
                    </form>

                    <h3>{t('Medicine List')}</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('Brand')}</th>
                                <th>{t('Generic')}</th>
                                <th>{t('Price')}</th>
                                <th>{t('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map(m => (
                                <tr key={m._id}>
                                    <td>{m.brandName}</td>
                                    <td>{m.genericName}</td>
                                    <td>₹{m.price}</td>
                                    <td><button onClick={() => handleDelete(m._id)} className={styles.deleteBtn}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className={styles.section}>
                    <h3>{t('Audit Logs')}</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('Date')}</th>
                                <th>{t('Searched')}</th>
                                <th>{t('Recommended')}</th>
                                <th>{t('Risk')}</th>
                                <th>{t('Savings')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditLogs.map(log => (
                                <tr key={log._id}>
                                    <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                                    <td>{log.searchedBrand}</td>
                                    <td>{log.recommendedGeneric}</td>
                                    <td>
                                        <span className={`${styles.riskBadge} ${styles[log.riskLevel.toLowerCase()]}`}>
                                            {log.riskLevel}
                                        </span>
                                    </td>
                                    <td>₹{log.savingsAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
