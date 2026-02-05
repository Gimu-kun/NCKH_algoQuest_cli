import axios from 'axios';
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token') || Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default apiClient;