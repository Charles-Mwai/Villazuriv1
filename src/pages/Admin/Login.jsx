import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (password === adminPassword) {
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_login_time', new Date().getTime().toString());
            navigate('/admin/dashboard');
        } else {
            setError('Invalid password');
            setPassword('');
        }

        setLoading(false);
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
