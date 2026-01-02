import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // backend port
    withCredentials: false,
});

// 🔴 TEMP DEV TOKEN (REMOVE LATER)
api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU2MzZmNWRhNWY2ZjQwN2RjNWU1NjMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzI1Nzk1MSwiZXhwIjoxNzY3ODYyNzUxfQ.9Xq-hvnxZa_TCWmRj8j1Qtt739UTSO0vLWES89T-ddk`;
    return config;
});


export default api;
