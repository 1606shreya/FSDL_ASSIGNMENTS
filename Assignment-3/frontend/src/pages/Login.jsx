import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Check } from 'lucide-react';
import InputGroup from '../components/InputGroup';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';
import styles from './Auth.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user info instead of just an array
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                }

                // Keep backward compatibility structure for dashboard user object 
                // but include the real token
                const userObj = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    token: data.token,
                };

                localStorage.setItem('users', JSON.stringify([userObj]));
                localStorage.setItem('token', data.token);

                alert(`Welcome back, ${data.name}! Login successful.`);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            setError('Server error, please try again later.');
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Log in to your account">
            <form onSubmit={handleSubmit} noValidate>
                <InputGroup
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                />
                <InputGroup
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                />

                <div className={styles.optionsRow}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={styles.checkbox}
                        />
                        Remember me
                    </label>
                    <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <Button type="submit" variant="primary">
                    Log In
                </Button>
            </form>
            <div className={styles.footer}>
                <p>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
