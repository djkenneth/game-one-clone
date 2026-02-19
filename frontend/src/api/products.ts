import axiosInstance from './axiosInstance';

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
}

export const getProducts = async (params: ProductsParams = {}) => {
  const response = await axiosInstance.get('/api/products', { params });
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
};
