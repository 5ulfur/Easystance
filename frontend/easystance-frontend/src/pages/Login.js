import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import logo from "../assets/images/logo.png";
import "../assets/styles/Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const togglePasswordShow = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={logo} alt="Logo"/>
                <h2>{t(`app_name`)}</h2>
                <p>{t(`slogan`)}</p>
            </div>
            <div className="login-right">
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={togglePasswordShow}>
                            {showPassword ? '🛇' : '👁'}
                        </span>
                    </div>
                    <button type="submit">{t(`login`)}</button>
                    {error && <p className="error-box"><strong>{error}</strong></p>}
                </form>
            </div>
        </div>
    );
};

export default Login;