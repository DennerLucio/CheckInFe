import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalAPI = true;

const axiosConfig = {
  baseURL: useLocalAPI
    ? 'http://172.26.240.1:5001/' // Local
    : 'https://api.checkinfe.com.br/', // Produção
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
};

const api: AxiosInstance = axios.create(axiosConfig);

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
