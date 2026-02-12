import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get('/user/auth/me');
            console.log(response);
            setUser(response.data.user);
        } catch (error) {
            console.log("Not authenticated");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/user/auth/login', { email, password });
        console.log(response);
        const { user } = response.data;
        setUser(user);
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/user/auth/register', userData);
        const { user } = response.data;
        setUser(user);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/user/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
