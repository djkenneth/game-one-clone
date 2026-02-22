import axiosInstance from './axiosInstance';

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
}

// Products
export const getProducts = (params: ProductsParams = {}) =>
  axiosInstance.get('/api/products', { params });
export const getProduct = (id: number) => axiosInstance.get(`/api/products/${id}`);
export const createProduct = (data: Record<string, unknown>) =>
  axiosInstance.post('/api/products', data);
export const updateProduct = (id: number, data: Record<string, unknown>) =>
  axiosInstance.put(`/api/products/${id}`, data);
export const deleteProduct = (id: number) => axiosInstance.delete(`/api/products/${id}`);

// Variants
export const getVariants = (productId: number) =>
  axiosInstance.get(`/api/products/${productId}/variants`);
export const createVariant = (productId: number, data: Record<string, unknown>) =>
  axiosInstance.post(`/api/products/${productId}/variants`, data);
export const updateVariant = (id: number, data: Record<string, unknown>) =>
  axiosInstance.put(`/api/products/variants/${id}`, data);
export const deleteVariant = (id: number) =>
  axiosInstance.delete(`/api/products/variants/${id}`);

// Images
export const addProductImage = (productId: number, data: Record<string, unknown>) =>
  axiosInstance.post(`/api/products/${productId}/images`, data);
export const deleteProductImage = (id: number) =>
  axiosInstance.delete(`/api/products/images/${id}`);

// Options
export const createProductOption = (productId: number, data: Record<string, unknown>) =>
  axiosInstance.post(`/api/products/${productId}/options`, data);
export const updateProductOption = (id: number, data: Record<string, unknown>) =>
  axiosInstance.put(`/api/products/options/${id}`, data);
export const deleteProductOption = (id: number) =>
  axiosInstance.delete(`/api/products/options/${id}`);

// Tags
export const addProductTag = (productId: number, tag: string) =>
  axiosInstance.post(`/api/products/${productId}/tags`, { tag });
export const removeProductTag = (productId: number, tag: string) =>
  axiosInstance.delete(`/api/products/${productId}/tags/${tag}`);
