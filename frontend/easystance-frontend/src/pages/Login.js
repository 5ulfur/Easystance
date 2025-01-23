import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import logo from "../assets/images/logo.png";
import "../assets/styles/Login.css";

const Login = () => {
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
                <h2>{t(`app_name`)}</h2>
                <p>{t(`slogan`)}</p>
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
                    <button type="submit">{t(`login`)}</button>
                    {error && <p class="error-box">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;