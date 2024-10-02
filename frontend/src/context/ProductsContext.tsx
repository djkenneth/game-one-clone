import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getProducts } from '../api/products';
import { Product } from '@/types';

// Define the shape of our context state
interface ProductsContextType {
    products: Product[]; // Replace `any[]` with your product type
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    fetchProducts: (skip: number, take: number, filters?: unknown) => Promise<void>;
    skip: number;
    setSkip: (skip: number) => void;
    take: number;
    setTake: (take: number) => void;
    nextPage: () => void;
    previesPage: () => void;
    pages: number[];
    isPreviousActive: boolean;
    isNextActive: boolean;
    totalCount: number;
    lowestPrice: number;
    highestPrice: number;
}

// Create the context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider component
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const rowPerPage = 20;
    const [products, setProducts] = useState<Product[]>([]);
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(rowPerPage);
    const [totalCount, setTotalCount] = useState(0)
    const [pages, setPages] = useState<number[]>([])
    const [lowestPrice, setLowestPrice] = useState(0);
    const [highestPrice, setHightestPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch products
    const fetchProducts = async (_skip: number, _take: number, filters?: unknown) => {
        setIsLoading(true);
        setError(null);

        try {
            const { products, count, lowestPrice: lowest, highestPrice: highest } = await getProducts(_skip, _take, filters);

            setTotalCount(count)
            setLowestPrice(lowest)
            setHightestPrice(highest)
            setProducts(products); // Set products in state

        } catch (err) {
            console.log(err)
            setError('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const nextPage = () => {
        setSkip(skip + rowPerPage);
    }

    const previesPage = () => {
        setSkip(skip - rowPerPage);
    }

    const isPreviousActive = skip > 0 ? true : false;
    const isNextActive = (totalCount - rowPerPage) >= skip ? true : false;


    const numberOfPage = () => {
        const result = [];
        let value = 0;

        const _numberOfPage = totalCount / rowPerPage;

        for (let i = 0; i < _numberOfPage; i++) {
            result[i] = value;
            value += 20;  // Increment the value by 20
        }

        console.log(result)

        setPages(result);
    }

    useEffect(() => {
        numberOfPage();
    }, [totalCount])

    useEffect(() => {
        fetchProducts(skip, take); // Automatically fetch products when the component mounts
    }, []);

    const value = {
        products,
        isLoading,
        setIsLoading,
        error,
        fetchProducts,
        skip,
        setSkip,
        take,
        setTake,
        nextPage,
        previesPage,
        pages,
        isPreviousActive,
        isNextActive,
        totalCount,
        lowestPrice,
        highestPrice
    }

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
};

// Custom hook to use the ProductsContext
export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};
