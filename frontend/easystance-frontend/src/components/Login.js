import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import "./Login.css";
import logo from '../logo.png';

/*const mockUsers = [
    { email: 'user1@email.com', password: 'password1' },
    { email: 'user2@email.com', password: 'password2' },
];*/

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

    /*const handleLogin = () => {
        const user = mockUsers.find(
            (user) => user.email === email && user.password === password
        );

        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
            navigate('/home');
        }
    }*/

    return (
        <div class="login-container">
            <div class="login-left">
                <img src={logo} alt="Logo"/>
                <h1>Easystance</h1>
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
                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;