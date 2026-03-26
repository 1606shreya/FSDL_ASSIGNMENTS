import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import InputGroup from '../components/InputGroup';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';
import styles from './Auth.module.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Alert and redirect
                    alert('Account created successfully! Please login.');
                    navigate('/login');
                } else {
                    setErrors({ email: data.message || 'Registration failed' });
                }
            } catch (err) {
                console.error(err);
                setErrors({ email: 'Server error, please try again later.' });
            }
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join us for better healthcare">
            <form onSubmit={handleSubmit} noValidate>
                <InputGroup
                    label="Full Name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    icon={User}
                />
                <InputGroup
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={Mail}
                />
                <InputGroup
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={Lock}
                />
                <InputGroup
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={Lock}
                />
                <div className={styles.trustNote}>
                    <ShieldCheck size={16} />
                    <span>Your medical data is kept secure and private.</span>
                </div>
                <Button type="submit" variant="primary">
                    Sign Up
                </Button>
            </form>
            <div className={styles.footer}>
                <p>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Signup;
