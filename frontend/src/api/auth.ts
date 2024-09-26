import axiosInstance from './axiosInstance';
import { AuthResponse, LoginData, SignupData } from '@/types/auth';

export const signup = async (data: SignupData) => {
    const response = await axiosInstance.post('/api/auth/signup', data);
    return response;
};

export const login = async (data: LoginData) => {
    const response = await axiosInstance.post('/api/auth/login', data);
    return response;
};

export const generateRefreshToken = async (token: string) => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/refresh-token', { refreshToken: token });
    return response.data;
};

export const logout = async (): Promise<void> => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

};

export const getUser = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('No access token available')
    };

    const response = await axiosInstance.get('/api/auth/me');
    return response.data;
};