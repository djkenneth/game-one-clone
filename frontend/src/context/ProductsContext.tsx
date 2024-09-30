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
    totalCount: number;
    lowestPrice: number;
    highestPrice: number;
}

// Create the context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider component
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]); // Replace `any[]` with your product type
    const [totalCount, setTotalCount] = useState(0)
    const [lowestPrice, setLowestPrice] = useState(0);
    const [highestPrice, setHightestPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Function to fetch products
    const fetchProducts = async (skip: number, take: number, filters?: unknown) => {
        setIsLoading(true);
        setError(null);

        try {
            const { products, count, lowestPrice: lowest, highestPrice: highest } = await getProducts(skip, take, filters);
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

    useEffect(() => {
        fetchProducts(0, 36); // Automatically fetch products when the component mounts
    }, []);

    const value = { products, isLoading, setIsLoading, error, fetchProducts, totalCount, lowestPrice, highestPrice }

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
