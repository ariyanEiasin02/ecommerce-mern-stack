'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, Cart, CartItem } from '@/services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  total: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number, variant?: { type: string; value: string }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity: number, variant?: { type: string; value: string }) => {
    const data = await cartService.addToCart({ productId, quantity, variant });
    setCart(data);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const data = await cartService.updateCartItem(itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId: string) => {
    const data = await cartService.removeFromCart(itemId);
    setCart(data);
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart(null);
  };

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    const discount = item.product?.discount ?? 0;
    const effectivePrice = price - (price * discount / 100);
    return sum + effectivePrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, items, itemCount, total, loading, addToCart, updateQuantity, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
