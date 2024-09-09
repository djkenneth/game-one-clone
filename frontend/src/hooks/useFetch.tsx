import axios from "axios";
import { useEffect, useState } from "react"

interface FetchResult<T> {
    isLoading: boolean;
    data: T | null;
    serverError: unknown;
}

const useFetch = <T,>(url: string): FetchResult<T> => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<T | null>(null);
    const [serverError, setServerError] = useState<unknown>(null);

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            try {
                const res = await axios.get<T>(`${import.meta.env.VITE_BASE_URL}${url}`);
                const data = await res?.data;
                setData(data);
                setIsLoading(false)
            } catch (error) {
                setServerError(error)
                setIsLoading(false)
            }
        }

        fetchData()
    }, [url])

    return { isLoading, data, serverError }
}

export default useFetch;