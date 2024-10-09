import { AddCartItemData, ChangeQuantityCartItemdata } from '@/types/cart';
import axiosInstance from './axiosInstance';


export const addToCartItem = async (data: AddCartItemData) => {
    const response = await axiosInstance.post('/api/cart', data);
    return response;
}

export const deleteCartItem = async (cartId: string) => {
    const response = await axiosInstance.delete(`/api/cart/${cartId}`);
    return response;
}

export const changeQuantityCartItem = async ({ cartId, quantity }: ChangeQuantityCartItemdata) => {
    const response = await axiosInstance.put(`/api/cart/${cartId}`, {
        quantity
    })
    return response
}

export const getAllCartItem = async () => {
    const response = await axiosInstance.get('/api/cart');
    return response;
} 