import axios from 'axios';

// Buat instance Axios
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Tambahkan interceptor untuk request
apiClient.interceptors.request.use(
    (config) => {
        // Ambil token dari local storage
        const token = localStorage.getItem('authToken');

        // Jika token ada, tambahkan ke header Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Lakukan sesuatu jika terjadi error pada request
        return Promise.reject(error);
    }
);

export default apiClient;