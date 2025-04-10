import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalAPI = false;

const axiosConfig = {
  baseURL: useLocalAPI
    ? 'http://192.168.56.1:5000/' // Local
    : 'http://212.85.17.233:5001/', // Produção
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
