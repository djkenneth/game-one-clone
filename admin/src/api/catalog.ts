import axiosInstance from './axiosInstance';

// Categories
export const getCategories = () => axiosInstance.get('/api/catalog/categories');
export const getCategory = (id: number) => axiosInstance.get(`/api/catalog/categories/${id}`);
export const createCategory = (data: { name: string; description?: string; parentId?: number }) =>
  axiosInstance.post('/api/catalog/categories', data);
export const updateCategory = (id: number, data: { name?: string; description?: string; isActive?: boolean }) =>
  axiosInstance.put(`/api/catalog/categories/${id}`, data);

// Brands
export const getBrands = () => axiosInstance.get('/api/catalog/brands');
export const createBrand = (data: { name: string; logoUrl?: string }) =>
  axiosInstance.post('/api/catalog/brands', data);
export const updateBrand = (id: number, data: { name?: string; logoUrl?: string }) =>
  axiosInstance.put(`/api/catalog/brands/${id}`, data);
export const deleteBrand = (id: number) => axiosInstance.delete(`/api/catalog/brands/${id}`);
