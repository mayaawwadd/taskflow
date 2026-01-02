import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // backend port
    withCredentials: false,
});

export default api;
