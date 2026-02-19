import axiosInstance from './axiosInstance';

export interface CreateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  birthday?: string;
}

export interface CreateAddressData {
  fullName: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export const getProfile = async () => {
  const response = await axiosInstance.get('/api/users/profile');
  return response.data;
};

export const createProfile = async (data: CreateProfileData) => {
  const response = await axiosInstance.post('/api/users/profile', data);
  return response.data;
};

export const updateProfile = async (data: Partial<CreateProfileData>) => {
  const response = await axiosInstance.put('/api/users/profile', data);
  return response.data;
};

export const getAddresses = async () => {
  const response = await axiosInstance.get('/api/users/address');
  return response.data;
};

export const createAddress = async (data: CreateAddressData) => {
  const response = await axiosInstance.post('/api/users/address', data);
  return response.data;
};

export const updateAddress = async (id: number, data: Partial<CreateAddressData>) => {
  const response = await axiosInstance.put(`/api/users/address/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id: number) => {
  const response = await axiosInstance.delete(`/api/users/address/${id}`);
  return response.data;
};
