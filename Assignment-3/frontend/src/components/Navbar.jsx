import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, UserCircle, LogOut, FileText, Heart, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ toggleSidebar, user }) => {
    const { t } = useTranslation();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('rememberedEmail');
        navigate('/login');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setShowDropdown(false);
    }

    return (
        <header className={styles.navbar}>
            <div className={styles.leftSection}>
                <button onClick={toggleSidebar} className={styles.menuButton}>
                    <Menu size={24} />
                </button>
                <div className={styles.searchContainer}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={t("Search medicines, components...")}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.rightSection}>
                <LanguageSwitcher />

                <button className={styles.iconButton}>
                    <Bell size={20} />
                    <span className={styles.badge}>3</span>
                </button>

                <div className={styles.profileContainer} ref={dropdownRef}>
                    <button className={styles.profileDropdownTrigger} onClick={toggleDropdown}>
                        <div className={styles.profileIcon}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={20} />}
                        </div>
                        <span className={styles.userName}>{user?.name || t('Guest')}</span>
                        <ChevronDown size={14} color="var(--text-tertiary)" />
                    </button>

                    {showDropdown && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.userHeader}>
                                <h4>{user?.name || t('Guest')}</h4>
                                <p>{user?.email || 'guest@example.com'}</p>
                            </div>
                            
                            <button className={styles.dropdownItem} onClick={() => handleNavigate('/dashboard/profile')}>
                                <User size={16} /> {t('View Profile')}
                            </button>
                            <button className={styles.dropdownItem} onClick={() => handleNavigate('/dashboard/medical-profile')}>
                                <FileText size={16} /> {t('Medical Information')}
                            </button>
                            <button className={styles.dropdownItem} onClick={() => handleNavigate('/dashboard/saved')}>
                                <Heart size={16} /> {t('Saved Medicines')}
                            </button>
                            
                            <div className={styles.separator}></div>
                            
                            <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                                <LogOut size={16} /> {t('Logout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
