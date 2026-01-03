import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // your axios instance
import { notify } from '../utils/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------- Load token on app start ---------- */
    useEffect(() => {
        const storedToken =
            localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!storedToken) {
            setLoading(false);
            return;
        }

        setToken(storedToken);

        // validate token + load user
        api.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        })
            .then((res) => {
                setUser(res.data.user);
            })
            .catch(() => {
                logout(); // token invalid or expired
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    /* ---------- Login ---------- */
    const login = (userData, jwtToken, remember = true) => {
        setUser(userData);
        setToken(jwtToken);

        if (remember) {
            localStorage.setItem('token', jwtToken);
        } else {
            sessionStorage.setItem('token', jwtToken);
        }
    };

    /* ---------- Logout ---------- */
    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        notify.info('Logged out');
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: Boolean(user),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/* ---------- Hook ---------- */
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
};
