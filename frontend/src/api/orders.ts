import axiosInstance from './axiosInstance';

export interface CreateOrderData {
  shopId: number;
  addressId: number;
  items: Array<{ productVariantId: number; quantity: number; price: number }>;
}

export const createOrder = async (data: CreateOrderData) => {
  const response = await axiosInstance.post('/api/orders', data);
  return response.data;
};

export const getOrders = async (page?: number, limit?: number) => {
  const response = await axiosInstance.get('/api/orders', { params: { page, limit } });
  return response.data;
};

export const getOrder = async (id: number) => {
  const response = await axiosInstance.get(`/api/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id: number) => {
  const response = await axiosInstance.put(`/api/orders/${id}/cancel`);
  return response.data;
};
