import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getProducts } from '../api/products';
import { Product } from '@/types';

// Define the shape of our context state

type FetchProductsCategoryType = {
    skip?: number;
    take?: number;
    // category?: 'playstation' | 'nintendo' | 'laptop' | 'peripherals'
    category?: 'console' | 'ps4-games' | 'ps5-games' | 'accessories'
}

type FetchProductsType = {
    skip?: number;
    take?: number;
    filters?: unknown;
}

interface ProductsContextType {
    products: Product[]; // Replace `any[]` with your product type
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    fetchProducts: ({ skip, take, filters }: FetchProductsType) => Promise<void>;
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
    fetchCategoryProducts: ({ skip, take, category }: FetchProductsCategoryType) => Promise<void>;
    featuredPlayStation: Product[];
    featuredNintendo: Product[];
    featuredLaptop: Product[];
    featuredPCPeripherals: Product[];
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

    // Categories
    const [featuredPlayStation, setFeaturedPlayStation] = useState<Product[]>([]);
    const [featuredNintendo, setFeaturedNintendo] = useState<Product[]>([]);
    const [featuredLaptop, setFeaturedLaptop] = useState<Product[]>([]);
    const [featuredPCPeripherals, setFeaturedPCPeripherals] = useState<Product[]>([]);


    // Function to fetch products
    const fetchProducts = async ({
        skip = 0,
        take = rowPerPage,
        filters,
    }: FetchProductsType) => {
        setIsLoading(true);
        setError(null);

        try {
            const { products, count, lowestPrice: lowest, highestPrice: highest } = await getProducts(skip, take, filters);

            setProducts(products); // Set products in state\
            setTotalCount(count)
            setLowestPrice(lowest)
            setHightestPrice(highest)

        } catch (err) {
            console.log(err)
            setError('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch product by category
    const fetchCategoryProducts = async ({
        skip = 0,
        take = 10,
        category = 'console'
    }: FetchProductsCategoryType) => {
        setIsLoading(true);
        setError(null);

        const filters: any = {
            categories: { some: { slug: { contains: category } } }
        }

        try {
            const { products } = await getProducts(skip, take, filters);

            if (category === 'console') {
                setFeaturedPlayStation(products)
            } else if (category === 'ps4-games') {
                setFeaturedNintendo(products)
            } else if (category === 'ps5-games') {
                setFeaturedLaptop(products)
            } else if (category === 'accessories') {
                setFeaturedPCPeripherals(products)
            }

        } catch (err) {
            console.log(err)
            setError('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    }

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

        setPages(result);
    }

    useEffect(() => {
        numberOfPage();
    }, [totalCount])

    // useEffect(() => {
    //     fetchProducts(skip, take); // Automatically fetch products when the component mounts
    // }, []);

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
        highestPrice,
        fetchCategoryProducts,
        featuredPlayStation,
        featuredNintendo,
        featuredLaptop,
        featuredPCPeripherals
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
