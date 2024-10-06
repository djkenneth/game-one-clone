import { getProduct, getProducts } from '../api/products';
import { Product } from '@/types';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of our context state

type FetchProductsCategoryType = {
  skip?: number;
  take?: number;
  // category?: 'playstation' | 'nintendo' | 'laptop' | 'peripherals'
  category?: 'console' | 'ps4-games' | 'ps5-games' | 'accessories';
};

type FetchProductsType = {
  skip?: number;
  take?: number;
  filters?: unknown;
};

interface ProductsContextType {
  products: Product[]; // Replace `any[]` with your product type
  product: Product | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  onFetchProducts: ({ skip, take, filters }: FetchProductsType) => Promise<void>;
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
  onFetchCategoryProducts: ({ skip, take, category }: FetchProductsCategoryType) => Promise<void>;
  featuredPlayStation: Product[];
  featuredNintendo: Product[];
  featuredLaptop: Product[];
  featuredPCPeripherals: Product[];
  onFetchProduct: ({ id }: { id: number }) => Promise<void>;
}

// Create the context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider component
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const rowPerPage = 20;
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(rowPerPage);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pages, setPages] = useState<number[]>([]);
  const [lowestPrice, setLowestPrice] = useState<number>(0);
  const [highestPrice, setHightestPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Categories
  const [featuredPlayStation, setFeaturedPlayStation] = useState<Product[]>([]);
  const [featuredNintendo, setFeaturedNintendo] = useState<Product[]>([]);
  const [featuredLaptop, setFeaturedLaptop] = useState<Product[]>([]);
  const [featuredPCPeripherals, setFeaturedPCPeripherals] = useState<Product[]>([]);

  const onFetchProduct = async ({ id }: { id: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProduct(id);
      setProduct(data);
      // console.log('data', data);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch product');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch products
  const onFetchProducts = async ({ skip = 0, take = rowPerPage, filters }: FetchProductsType) => {
    setIsLoading(true);
    setError(null);

    try {
      const { products, count, lowestPrice: lowest, highestPrice: highest } = await getProducts(skip, take, filters);

      setProducts(products); // Set products in state\
      setTotalCount(count);
      setLowestPrice(lowest);
      setHightestPrice(highest);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch product by category
  const onFetchCategoryProducts = async ({ skip = 0, take = 10, category = 'console' }: FetchProductsCategoryType) => {
    setIsLoading(true);
    setError(null);

    const filters: any = {
      categories: { some: { slug: { contains: category } } }
    };

    try {
      const { products } = await getProducts(skip, take, filters);

      if (category === 'console') {
        setFeaturedPlayStation(products);
      } else if (category === 'ps4-games') {
        setFeaturedNintendo(products);
      } else if (category === 'ps5-games') {
        setFeaturedLaptop(products);
      } else if (category === 'accessories') {
        setFeaturedPCPeripherals(products);
      }
    } catch (err) {
      console.log(err);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = () => {
    setSkip(skip + rowPerPage);
  };

  const previesPage = () => {
    setSkip(skip - rowPerPage);
  };

  const isPreviousActive = skip > 0 ? true : false;
  const isNextActive = totalCount - rowPerPage >= skip ? true : false;

  const numberOfPage = () => {
    const result = [];
    let value = 0;

    const _numberOfPage = totalCount / rowPerPage;

    for (let i = 0; i < _numberOfPage; i++) {
      result[i] = value;
      value += 20; // Increment the value by 20
    }

    setPages(result);
  };

  useEffect(() => {
    numberOfPage();
  }, [totalCount]);

  // useEffect(() => {
  //     onFetchProducts(skip, take); // Automatically fetch products when the component mounts
  // }, []);

  const value = {
    // state
    products,
    product,
    isLoading,
    setIsLoading,
    error,
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
    featuredPlayStation,
    featuredNintendo,
    featuredLaptop,
    featuredPCPeripherals,

    // function hooks
    onFetchCategoryProducts,
    onFetchProducts,
    onFetchProduct
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

// Custom hook to use the ProductsContext
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
