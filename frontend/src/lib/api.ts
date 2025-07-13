import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// You can add interceptors for handling tokens or errors globally
api.interceptors.request.use((config) => {
    // e.g., get token from local storage and add to headers
    return config;
});

export { api };