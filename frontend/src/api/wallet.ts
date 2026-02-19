import axiosInstance from './axiosInstance';

export const getWallet = async () => {
  const response = await axiosInstance.get('/api/wallet');
  return response.data;
};

export const getTransactions = async (page?: number, limit?: number) => {
  const response = await axiosInstance.get('/api/wallet/transactions', { params: { page, limit } });
  return response.data;
};

export const deposit = async (amount: number) => {
  const response = await axiosInstance.post('/api/wallet/deposit', { amount });
  return response.data;
};

export const withdraw = async (amount: number) => {
  const response = await axiosInstance.post('/api/wallet/withdraw', { amount });
  return response.data;
};
