import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getProduct, getProducts } from '@/api/products';
import type { Product } from '@/types';

type FetchProductsType = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
};

interface ProductsContextType {
  products: Product[];
  product: Product | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  onFetchProducts: (params?: FetchProductsType) => Promise<void>;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  totalCount: number;
  totalPages: number;
  onFetchProduct: (id: number) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalCount / limit);

  const onFetchProducts = async (params: FetchProductsType = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProducts({ limit, page, ...params });
      setProducts(res.data.products);
      setTotalCount(res.data.total);
    } catch {
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const onFetchProduct = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProduct(id);
      setProduct(res.data.product);
    } catch {
      setError('Failed to fetch product');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onFetchProducts({ page });
  }, [page]);

  const value = {
    products,
    product,
    isLoading,
    setIsLoading,
    error,
    onFetchProducts,
    page,
    setPage,
    limit,
    totalCount,
    totalPages,
    onFetchProduct,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
};
