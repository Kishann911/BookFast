import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    // Set axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/auth/me`);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Load user error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            const { token: newToken, ...userData } = res.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                email,
                password,
                role
            });

            const { token: newToken, ...userData } = res.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
