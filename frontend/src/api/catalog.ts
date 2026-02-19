import axiosInstance from './axiosInstance';

export const getCategories = async () => {
  const response = await axiosInstance.get('/api/catalog/categories');
  return response.data;
};

export const getBrands = async () => {
  const response = await axiosInstance.get('/api/catalog/brands');
  return response.data;
};
