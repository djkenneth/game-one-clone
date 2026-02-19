import axiosInstance from './axiosInstance';

export const getCart = async () => {
  const response = await axiosInstance.get('/api/cart');
  return response.data;
};

export const addCartItem = async (productVariantId: number, quantity: number) => {
  const response = await axiosInstance.post('/api/cart', { productVariantId, quantity });
  return response.data;
};

export const updateCartItem = async (id: number, quantity: number) => {
  const response = await axiosInstance.put(`/api/cart/${id}`, { quantity });
  return response.data;
};

export const removeCartItem = async (id: number) => {
  const response = await axiosInstance.delete(`/api/cart/${id}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete('/api/cart/clear');
  return response.data;
};
