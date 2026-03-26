import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Scale, Bookmark, User, LogOut, Pill, MapPin } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        // Clear user session if needed
        localStorage.removeItem('rememberedEmail'); // Optional: clear remember me
        navigate('/login');
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}>
                <Pill className={styles.logoIcon} size={32} />
                <span className={styles.brandName}>MedFinder</span>
            </div>

            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} end>
                    <LayoutDashboard size={20} />
                    <span>{t('Dashboard')}</span>
                </NavLink>
                <NavLink to="/dashboard/search" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                    <Search size={20} />
                    <span>{t('Search')}</span>
                </NavLink>
                <NavLink to="/dashboard/compare" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                    <Scale size={20} />
                    <span>{t('Compare')}</span>
                </NavLink>
                <NavLink to="/dashboard/pharmacies" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                    <MapPin size={20} />
                    <span>{t('Nearby Pharmacies')}</span>
                </NavLink>
                <NavLink to="/dashboard/saved" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                    <Bookmark size={20} />
                    <span>{t('Saved')}</span>
                </NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                    <User size={20} />
                    <span>{t('Profile')}</span>
                </NavLink>
            </nav>

            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={20} />
                    <span>{t('Logout')}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
