import api from './axios';

/* ================= AUTH ================= */

export const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // { token, user }
};

export const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data; // { message, user }
};

export const getMe = async () => {
    const res = await api.get('/auth/me');
    return res.data.user;
};
