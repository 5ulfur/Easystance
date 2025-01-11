import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.getUser}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setAuthUser(data.user);
                } else {
                    setAuthUser(null);
                }
            } catch {
                setAuthUser(null);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.login}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                setAuthUser(data.user);
                navigate('/home');
            } else {
                throw new Error('Accesso negato')
            }
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }

    const logout = async () => {
        try {
            await fetch(`${config.apiUrl}${config.endpoints.logout}`, {
                method: 'POST',
                credentials: 'include'
            });
            setAuthUser(null);
            navigate('/login');
        } catch (error) {
            console.error(error.message)
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ authUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);