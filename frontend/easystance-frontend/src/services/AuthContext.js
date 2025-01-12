import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            if(!token) return;

            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.checkAuth}`, {
                    headers: { 'Authorization': token }
                });
    
                if (!response.ok) {
                    setToken(null);
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                setToken(null);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        checkAuth();
    }, [token, navigate]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.login}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if(response.ok) {
                const data = await response.json();
                setToken(data.token);
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                throw new Error('Email o password non validi')
            }
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            await fetch(`${config.apiUrl}${config.endpoints.logout}`, {
                method: 'POST'
            });
        } catch (error) {
            throw error;
        } finally {
            setToken(null);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);