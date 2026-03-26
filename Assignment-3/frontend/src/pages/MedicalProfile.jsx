import React, { useState, useEffect } from 'react';
import { Save, Edit2, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import InputGroup from '../components/InputGroup';
import { useTranslation } from '../hooks/useTranslation';
import styles from './MedicalProfile.module.css';

const MedicalProfile = () => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: 'Male',
        bloodGroup: '',
        allergies: '',
        medications: '',
        conditions: {
            diabetes: false,
            hypertension: false,
            asthma: false,
            thyroid: false
        },
        emergencyContact: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.medicalProfile) {
                        setFormData(prev => ({
                            ...prev,
                            fullName: data.name || prev.fullName,
                            age: data.medicalProfile.age || '',
                            gender: data.medicalProfile.gender || 'Male',
                            bloodGroup: data.medicalProfile.bloodGroup || '',
                            allergies: data.medicalProfile.allergies?.join(', ') || '',
                            medications: data.medicalProfile.currentMedications?.join(', ') || '',
                            conditions: {
                                diabetes: data.medicalProfile.conditions?.diabetes || false,
                                hypertension: data.medicalProfile.conditions?.hypertension || false,
                                asthma: data.medicalProfile.conditions?.asthma || false,
                                thyroid: data.medicalProfile.conditions?.thyroid || false
                            },
                            emergencyContact: data.medicalProfile.emergencyContact || ''
                        }));
                    } else {
                        setFormData(prev => ({ ...prev, fullName: data.name }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (condition) => {
        setFormData(prev => ({
            ...prev,
            conditions: {
                ...prev.conditions,
                [condition]: !prev.conditions[condition]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Format for backend
            const medicalProfile = {
                age: formData.age ? Number(formData.age) : undefined,
                gender: formData.gender,
                bloodGroup: formData.bloodGroup,
                allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
                currentMedications: formData.medications.split(',').map(s => s.trim()).filter(Boolean),
                chronicDiseases: Object.keys(formData.conditions).filter(k => formData.conditions[k]),
                conditions: formData.conditions,
                emergencyContact: formData.emergencyContact
            };

            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.fullName,
                    medicalProfile
                })
            });

            if (response.ok) {
                setIsEditing(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('Medical Profile')}</h1>
                <p className={styles.subtitle}>{t('Manage your health information for better recommendations.')}</p>
            </header>

            {showSuccess && (
                <div className={styles.successMessage}>
                    <ShieldCheck size={20} />
                    {t('Profile updated successfully!')}
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.trustNote}>
                        <ShieldCheck size={16} />
                        <span>{t('Private & Secure')}</span>
                    </div>
                    {!isEditing && (
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                            <Edit2 size={16} /> {t('Edit Profile')}
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <InputGroup
                            label={t("Full Name")}
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <div className={styles.row}>
                            <InputGroup
                                label={t("Age")}
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <div className={styles.selectGroup}>
                                <label className={styles.label}>{t('Gender')}</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={styles.select}
                                >
                                    <option value="Male">{t('Male')}</option>
                                    <option value="Female">{t('Female')}</option>
                                    <option value="Other">{t('Other')}</option>
                                </select>
                            </div>
                            <InputGroup
                                label={t("Blood Group")}
                                name="bloodGroup"
                                placeholder="O+"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('Known Allergies')}</label>
                            <textarea
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={styles.textarea}
                                placeholder={t("e.g., Penicillin, Peanuts...")}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('Current Medications')}</label>
                            <textarea
                                name="medications"
                                value={formData.medications}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={styles.textarea}
                                placeholder={t("List any medicines you are currently taking...")}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('Chronic Conditions')}</label>
                            <div className={styles.checkboxGroup}>
                                {Object.keys(formData.conditions).map(condition => (
                                    <label key={condition} className={`${styles.checkboxLabel} ${formData.conditions[condition] ? styles.checked : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.conditions[condition]}
                                            onChange={() => isEditing && handleCheckboxChange(condition)}
                                            disabled={!isEditing}
                                            className={styles.hiddenCheckbox}
                                        />
                                        {t(condition.charAt(0).toUpperCase() + condition.slice(1))}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <InputGroup
                            label={t("Emergency Contact Number")}
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    {isEditing && (
                        <div className={styles.actions}>
                            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" variant="primary">
                                <Save size={18} style={{ marginRight: '0.5rem' }} /> {t('Save Profile')}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
            <div className={styles.privacyFooter}>
                <AlertCircle size={16} />
                <p>{t('Your medical data is stored locally on your device and is used only to provide better medicine recommendations.')}</p>
            </div>
        </div>
    );
};

export default MedicalProfile;
