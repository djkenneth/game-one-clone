import api from './axiosInstance';

export const getProductReviews = (productId: number) =>
  api.get(`/api/reviews/product/${productId}`);

export const deleteReview = (id: number) => api.delete(`/api/reviews/${id}`);
