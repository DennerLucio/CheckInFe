import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';


const axiosConfig = {
  baseURL: 'https://web-app-controle-presenca-gsamegdaesaxdkd9.brazilsouth-01.azurewebsites.net/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
};

const api: AxiosInstance = axios.create(axiosConfig);


export default api;