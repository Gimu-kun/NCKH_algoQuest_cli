import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../config/environment';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token') || Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized - clearing auth token');
      localStorage.removeItem('auth_token');
      Cookies.remove('auth_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;