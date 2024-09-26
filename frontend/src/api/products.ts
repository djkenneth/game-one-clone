import axios from "axios"
import qs from "qs";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getProducts = async () => {
    const filters = {
        AND: [
            { price: { gte: 500 } },
            { price: { lte: 1000 } }
        ]
    }

    const queryString = qs.stringify(filters, { addQueryPrefix: true, encode: false }); // Serialize filtersconst queryString = qs.stringify(paylaod)
    // console.log('queryString', qs.parse(queryString))

    const { data } = await axios.get(`${BASE_URL}/api/products${queryString.length ? queryString : ''}`);
    return data;
}

