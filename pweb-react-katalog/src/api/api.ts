import axios from 'axios';

// ‼️ PENTING: GANTI URL INI
// Sesuaikan dengan URL dan PORT backend Express kamu.
// Jika API-mu ada prefix '/api', tambahkan juga.
const API_BASE_URL = 'http://localhost:4000'; 

// Membuat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor: Ini akan otomatis menempelkan token dari localStorage
// ke setiap request yang kamu kirim, KECUALI untuk login/register.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // 'authToken' = nama kuncinya
    if (token && !config.url?.includes('/login') && !config.url?.includes('/register')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;