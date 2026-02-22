import api from './axiosInstance';

export const getShops = (params?: { page?: number; limit?: number }) =>
  api.get('/api/shops', { params });

export const getShop = (id: number) => api.get(`/api/shops/${id}`);
