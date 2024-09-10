import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getProducts = async () => {

    const paylaod = {
        where: {
            AND: [
                { price: { gte: 500 } },
                { price: { lte: 1000 } }
            ]
        }
    }

    const { data } = await axios.post(`${BASE_URL}/products`, paylaod);
    return data;
}