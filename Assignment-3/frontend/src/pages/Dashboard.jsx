import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Bookmark, Activity, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import MedicineCard from '../components/MedicineCard';
import { useTranslation } from '../hooks/useTranslation';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);

    const { t } = useTranslation();

    const [user, setUser] = useState({ name: 'Guest', medicalProfile: { allergies: [], chronicDiseases: [], currentMedications: [] } });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Fallback for guests and backwards compatibility
                const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                if (storedUsers.length > 0) setUser(storedUsers[0]);
                return;
            }
            try {
                const res = await fetch('/api/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setUser({
                        name: data.name,
                        medicalProfile: data.medicalProfile || { allergies: [], chronicDiseases: [], currentMedications: [] }
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/medicine/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brandName: searchTerm,
                    medicalProfile: user.medicalProfile
                })
            });
            const data = await res.json();
            if (res.ok) {
                setResults(data);
                fetchNearbyPharmacies(data.recommended?._id);
            } else {
                alert(data.message);
                setResults(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyPharmacies = async (medicineId) => {
        try {
            // Hardcoded lat/lng for demo purposes. Ideally from Geolocation API.
            const res = await fetch(`/api/pharmacy/nearby?lat=28.6139&lng=77.2090${medicineId ? `&medicineId=${medicineId}` : ''}`);
            const data = await res.json();
            if (res.ok) setPharmacies(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = (medicine) => {
        alert(`Saved ${medicine.brandName} to your list!`);
    };

    return (
        <div className={styles.container}>
            <section className={styles.welcomeSection}>
                <h1 className={styles.greeting}>{t('Welcome back')}, {user?.name || 'Guest'} 👋</h1>
                <p className={styles.subtitle}>{t('Find affordable generic alternatives instantly.')}</p>
                <div className={styles.exampleBox}>
                    <strong>{t('Target')}:</strong> {t('Cost effective treatments.')}
                </div>
            </section>

            <section className={styles.searchSection}>
                <form className={styles.searchBarWrapper} onSubmit={handleSearch}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder={t("Enter branded medicine name (e.g., Crocin)...")}
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className={styles.searchButton} disabled={loading}>
                        {loading ? t('Searching...') : t('Search')}
                    </button>
                </form>
            </section>

            {results && (
                <div className={styles.resultsGrid}>
                    {/* Risk & Savings Panel */}
                    <div className={styles.insightsPanel}>
                        <div className={`${styles.riskCard} ${styles[results.riskAnalysis.level.toLowerCase()]}`}>
                            <div className={styles.flexHeader}>
                                {results.riskAnalysis.level === 'High' ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                                <h3>{t('Risk Level')}: {t(results.riskAnalysis.level)}</h3>
                            </div>
                            <ul className={styles.riskList}>
                                {results.riskAnalysis.explanations.map((exp, i) => <li key={i}>{t(exp)}</li>)}
                                {results.riskAnalysis.explanations.length === 0 && <li>{t('Safe based on your profile.')}</li>}
                            </ul>
                        </div>

                        {results.savings > 0 && (
                            <div className={styles.savingsCard}>
                                <TrendingUp size={24} className={styles.savingsIcon} />
                                <div>
                                    <h3>{t('Estimated Savings')}</h3>
                                    <p className={styles.savingsAmount}>₹{results.savings}</p>
                                    <p className={styles.savingsText}>{t('Compared to')} {results.original.brandName}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recommended Medicine */}
                    <div className={styles.recommendedSection}>
                        <h2>{t('Recommended Generic Equivalent')}</h2>
                        <MedicineCard medicine={{
                            name: results.recommended.brandName,
                            manufacturer: results.recommended.manufacturer || 'Generic Manufacturer',
                            genericName: results.recommended.genericName,
                            brandPrice: results.original.price,
                            genericPrice: results.recommended.price,
                            savedPercentage: Math.round((results.savings / results.original.price) * 100) || 0,
                            form: results.recommended.form,
                            strength: results.recommended.strength
                        }} onSave={() => handleSave(results.recommended)} />
                    </div>

                    {/* Nearby Pharmacies */}
                    <div className={styles.pharmacySection}>
                        <h2><MapPin size={20} style={{ verticalAlign: 'bottom', marginRight: '8px' }} /> {t('Nearby Availability')}</h2>
                        {pharmacies.length > 0 ? (
                            <ul className={styles.pharmacyList}>
                                {pharmacies.map(p => (
                                    <li key={p._id} className={styles.pharmacyItem}>
                                        <h4>{p.name}</h4>
                                        <p>{p.address}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{t('No nearby pharmacies found with stock.')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Show recent/trending if no results */}
            {!results && (
                <section className={styles.statsGrid}>
                    <StatCard title={t("Total Searches")} value="1,245" icon={Search} color="#3b82f6" />
                    <StatCard title={t("Total Savings")} value="₹45,200" icon={TrendingUp} color="#10b981" />
                    <StatCard title={t("Saved Medicines")} value="12" icon={Bookmark} color="#f59e0b" />
                </section>
            )}
        </div>
    );
};

export default Dashboard;
