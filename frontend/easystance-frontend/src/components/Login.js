import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import "./Login.css";
import logo from '../assets/logo.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div class="login-container">
            <div class="login-left">
                <img src={logo} alt="Logo"/>
                <h1>Easystance</h1>
                <p>L'assistenza facile</p>
            </div>
            <div class="login-right">
                <form class="login-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    {error && <p class="error-box">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;