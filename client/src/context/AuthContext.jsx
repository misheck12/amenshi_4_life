import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await apiService.auth.me();
                    setAdmin(response.data.data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('admin');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (credentials) => {
        try {
            const response = await apiService.auth.login(credentials);
            const { token, admin } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('admin', JSON.stringify(admin));

            setToken(token);
            setAdmin(admin);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setToken(null);
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
