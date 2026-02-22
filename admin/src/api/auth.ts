import axiosInstance from './axiosInstance';

export const login = (email: string, password: string) =>
  axiosInstance.post('/api/auth/login', { email, password });

export const getMe = () => axiosInstance.get('/api/auth/me');
