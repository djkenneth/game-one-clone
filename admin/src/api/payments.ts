import api from './axiosInstance';

export const getOrderPayment = (orderId: number) =>
  api.get(`/api/payment/order/${orderId}`);

export const updatePaymentStatus = (paymentId: number, status: string) =>
  api.put(`/api/payment/${paymentId}/status`, { status });

export const createRefund = (paymentId: number, amount: number) =>
  api.post(`/api/payment/${paymentId}/refund`, { amount });
