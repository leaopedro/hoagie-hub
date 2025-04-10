import axios, { AxiosInstance } from 'axios';

export const createApi = (userId?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
  });

  if (userId) {
    instance.interceptors.request.use((config) => {
      config.headers['x-user-id'] = userId;
      return config;
    });
  }

  return instance;
};