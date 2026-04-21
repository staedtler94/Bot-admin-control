import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
