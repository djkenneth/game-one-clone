import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getProducts = async () => {
    const { data } = await axios.get(`${BASE_URL}/products`);
    return data;
}