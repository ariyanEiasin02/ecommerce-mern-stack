'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService, Wishlist, WishlistProduct } from '@/services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  items: WishlistProduct[];
  count: number;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      return;
    }
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch {
      setWishlist(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist?.products.some((p) => p._id === productId) ?? false;
    },
    [wishlist]
  );

  const toggleWishlist = async (productId: string) => {
    const res = await wishlistService.toggleWishlist(productId);
    setWishlist(res.data);
  };

  const items = wishlist?.products ?? [];
  const count = items.length;

  return (
    <WishlistContext.Provider
      value={{ wishlist, items, count, loading, isInWishlist, toggleWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
