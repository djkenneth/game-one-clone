import axiosInstance from './axiosInstance';

export const adminListUsers = (params: { page?: number; limit?: number } = {}) => {
  const skip = ((params.page ?? 1) - 1) * (params.limit ?? 20);
  const take = params.limit ?? 20;
  return axiosInstance.get('/api/users/admin', { params: { skip, take } });
};

export const adminGetUser = (id: number) =>
  axiosInstance.get(`/api/users/admin/${id}`);

export const adminUpdateRole = (id: number, role: string) =>
  axiosInstance.put(`/api/users/admin/${id}/role`, { role });
