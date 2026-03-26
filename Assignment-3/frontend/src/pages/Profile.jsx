import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Shield, Edit3, Settings } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import styles from './Profile.module.css';

const Profile = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState({ name: 'Loading...', email: '', role: 'Patient', joined: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                if (storedUsers.length > 0) {
                    setUser({
                        name: storedUsers[0].name || 'Guest User',
                        email: storedUsers[0].email || 'guest@example.com',
                        role: 'User',
                        joined: new Date().toLocaleDateString()
                    });
                }
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
                        email: data.email,
                        role: data.role || 'Patient',
                        joined: new Date(data.createdAt || Date.now()).toLocaleDateString()
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('Account Profile')}</h1>
                <p className={styles.subtitle}>{t('Manage your personal information and settings.')}</p>
            </div>

            <div className={styles.grid}>
                {/* Profile Card */}
                <div className={styles.profileCard}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            {user.name.charAt(0).toUpperCase()}
                            <button className={styles.editAvatarBtn} title={t("Change Avatar")}>
                                <Edit3 size={14} />
                            </button>
                        </div>
                        <div className={styles.userInfo}>
                            <h2>{user.name}</h2>
                            <span className={styles.badge}>{t(user.role)}</span>
                        </div>
                    </div>
                    
                    <div className={styles.detailsList}>
                        <div className={styles.detailItem}>
                            <Mail className={styles.icon} size={18} />
                            <div>
                                <span>{t('Email Address')}</span>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <Calendar className={styles.icon} size={18} />
                            <div>
                                <span>{t('Member Since')}</span>
                                <p>{user.joined}</p>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <MapPin className={styles.icon} size={18} />
                            <div>
                                <span>{t('Location')}</span>
                                <p>{t('Not provided')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <button className={styles.editBtn}>
                        <Settings size={18} />
                        {t('Edit Profile Settings')}
                    </button>
                </div>

                {/* Account Settings / Security */}
                <div className={styles.settingsSection}>
                    <div className={styles.settingsCard}>
                        <div className={styles.cardHeader}>
                            <Shield className={styles.headerIcon} size={20} />
                            <h3>{t('Security & Privacy')}</h3>
                        </div>
                        <div className={styles.settingItem}>
                            <div>
                                <h4>{t('Password')}</h4>
                                <p>{t('Last changed 3 months ago')}</p>
                            </div>
                            <button className={styles.actionBtn}>{t('Update')}</button>
                        </div>
                        <div className={styles.settingItem}>
                            <div>
                                <h4>{t('Two-Factor Authentication')}</h4>
                                <p>{t('Add an extra layer of security to your account')}</p>
                            </div>
                            <button className={styles.actionBtn}>{t('Enable')}</button>
                        </div>
                    </div>

                    <div className={styles.settingsCard}>
                        <div className={styles.cardHeader}>
                            <Settings className={styles.headerIcon} size={20} />
                            <h3>{t('Preferences')}</h3>
                        </div>
                        <div className={styles.settingItem}>
                            <div>
                                <h4>{t('Email Notifications')}</h4>
                                <p>{t('Receive updates about your saved medicines')}</p>
                            </div>
                            <label className={styles.switch}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
