import axios from "axios"
import qs from "qs";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getProducts = async (skip: number, take: number, filters: unknown) => {

    const queryString = qs.stringify(filters, { encode: false }); // Serialize filtersconst queryString = qs.stringify(paylaod)
    // console.log('queryString', qs.parse(queryString))
    // console.log('filters', filters)

    const { data } = await axios.get(`${BASE_URL}/api/products?${queryString.length ? queryString : ''}${queryString.length ? '&' : ''}skip=${skip}&take=${take}`);
    return data;
}

