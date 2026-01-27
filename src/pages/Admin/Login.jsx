import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        const attempts = parseInt(localStorage.getItem('admin_login_attempts') || '0');
        if (attempts >= 5) {
            const lastAttempt = parseInt(localStorage.getItem('admin_last_attempt') || '0');
            const now = new Date().getTime();
            if (now - lastAttempt < 300000) { // 5 minute lockout
                setError('Too many failed attempts. Please try again in 5 minutes.');
                setLoading(false);
                return;
            } else {
                localStorage.setItem('admin_login_attempts', '0');
            }
        }

        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Try backend verification endpoint first (production)
            const response = await fetch('/api/verify-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            // If API endpoint doesn't exist (404), fall back to dev mode
            if (response.status === 404) {
                console.warn('API endpoint not found - using development mode');

                // Development fallback - check against environment variable
                const devPassword = import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'admin123';

                if (password === devPassword) {
                    localStorage.setItem('admin_authenticated', 'true');
                    localStorage.setItem('admin_token', 'dev-token');
                    localStorage.setItem('admin_login_time', new Date().getTime().toString());
                    localStorage.setItem('admin_login_attempts', '0');
                    navigate('/admin/dashboard');
                } else {
                    const newAttempts = attempts + 1;
                    localStorage.setItem('admin_login_attempts', newAttempts.toString());
                    localStorage.setItem('admin_last_attempt', new Date().getTime().toString());
                    setError('Invalid password');
                    setPassword('');
                }
                return;
            }

            const data = await response.json();

            if (data.valid) {
                // Store authentication state and token
                localStorage.setItem('admin_authenticated', 'true');
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_login_time', new Date().getTime().toString());
                localStorage.setItem('admin_login_attempts', '0');
                navigate('/admin/dashboard');
            } else {
                const newAttempts = attempts + 1;
                localStorage.setItem('admin_login_attempts', newAttempts.toString());
                localStorage.setItem('admin_last_attempt', new Date().getTime().toString());
                setError(data.error || 'Invalid password');
                setPassword('');
            }
        } catch (error) {
            console.error('Login error:', error);

            // If fetch fails completely, use development fallback
            const devPassword = import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'admin123';

            if (password === devPassword) {
                console.warn('Using development mode authentication');
                localStorage.setItem('admin_authenticated', 'true');
                localStorage.setItem('admin_login_time', new Date().getTime().toString());
                navigate('/admin/dashboard');
            } else {
                setError('Invalid password (dev mode)');
                setPassword('');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Villa Zuri Admin</h1>
                <p className="login-subtitle">Enter password to access dashboard</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        autoFocus
                        required
                    />

                    {error && <div className="login-error">{error}</div>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
