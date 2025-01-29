import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import config from "../config/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    const clear = useCallback(() => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
        navigate("/login");
    }, [navigate]);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            try {
                const decoded = jwtDecode(savedToken);
                setRole(decoded.role);
            } catch (error) {
                clear();
            }
        }
        setIsLoading(false);
    }, [clear]);

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) return;

            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.checkAuth}`, {
                    headers: { "Authorization": token }
                });
    
                if (!response.ok) {
                    clear();
                }
            } catch (error) {
                clear();
            }
        };

        checkAuth();
    }, [token, clear]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.login}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                setToken("Bearer " + data.token);
                localStorage.setItem("token", "Bearer " + data.token);
                const decoded = jwtDecode(data.token);
                setRole(decoded.role);
                navigate("/tickets");
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            await fetch(`${config.apiUrl}${config.endpoints.logout}`, {
                method: "POST",
                headers: { "Authorization": token }
            });
        } catch (error) {
            throw error;
        } finally {
            clear();
        }
    }

    return (
        <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);