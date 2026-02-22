import api from './axiosInstance';

export const adminListOrders = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => api.get('/api/orders/admin', { params });

export const adminGetOrder = (id: number) => api.get(`/api/orders/admin/${id}`);

export const adminUpdateOrderStatus = (id: number, status: string) =>
  api.put(`/api/orders/admin/${id}/status`, { status });
