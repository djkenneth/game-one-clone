import axiosInstance from './axiosInstance';
import type { AuthResponse, LoginData, SignupData } from '@/types/auth';

export const signup = async (data: SignupData) => {
  const response = await axiosInstance.post('/api/auth/signup', data);
  return response;
};

export const login = async (data: LoginData) => {
  const response = await axiosInstance.post<{ success: boolean; data: AuthResponse }>('/api/auth/login', data);
  return response;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
};
