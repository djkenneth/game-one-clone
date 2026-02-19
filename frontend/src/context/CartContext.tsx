import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart as clearCartApi } from '@/api/cart';
import { useToast } from '@/hooks/use-toast';
import type { Cart } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productVariantId: number, quantity?: number) => Promise<void>;
  updateItem: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getCart();
      setCart(res.data.cart);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (productVariantId: number, quantity = 1) => {
    if (!isAuthenticated) {
      toast({ variant: 'destructive', description: 'Please log in to add items to cart.' });
      return;
    }
    try {
      await addCartItem(productVariantId, quantity);
      await fetchCart();
      toast({ description: 'Item added to cart.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Failed to add to cart.',
      });
    }
  };

  const updateItem = async (id: number, quantity: number) => {
    try {
      await updateCartItem(id, quantity);
      await fetchCart();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Failed to update cart.',
      });
    }
  };

  const removeItem = async (id: number) => {
    try {
      await removeCartItem(id);
      await fetchCart();
    } catch {
      toast({ variant: 'destructive', description: 'Failed to remove item.' });
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();
      setCart(null);
    } catch {
      // ignore
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, isLoading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
