import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';


const axiosConfig = {
  baseURL: 'http://192.168.56.1:5000/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
};

const api: AxiosInstance = axios.create(axiosConfig);


export default api;