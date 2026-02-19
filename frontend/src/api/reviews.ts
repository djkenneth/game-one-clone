import axiosInstance from './axiosInstance';

export interface CreateReviewData {
  productId: number;
  orderItemId: number;
  rating: number;
  comment?: string;
}

export const getProductReviews = async (productId: number, page?: number, limit?: number) => {
  const response = await axiosInstance.get(`/api/reviews/product/${productId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const createReview = async (data: CreateReviewData) => {
  const response = await axiosInstance.post('/api/reviews', data);
  return response.data;
};

export const getUserReviews = async (page?: number, limit?: number) => {
  const response = await axiosInstance.get('/api/reviews/mine', { params: { page, limit } });
  return response.data;
};

export const deleteReview = async (id: number) => {
  const response = await axiosInstance.delete(`/api/reviews/${id}`);
  return response.data;
};
