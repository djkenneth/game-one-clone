import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getProducts } from '../api/products';
import { Product } from '@/types';

// Define the shape of our context state
interface ProductsContextType {
    products: Product[]; // Replace `any[]` with your product type
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

// Create the context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider component
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]); // Replace `any[]` with your product type
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch products
    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { products } = await getProducts();
            setProducts(products); // Set products in state

        } catch (err) {
            console.log(err)
            setError('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Automatically fetch products when the component mounts
    }, []);

    return (
        <ProductsContext.Provider value={{ products, isLoading, error, fetchProducts }}>
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
