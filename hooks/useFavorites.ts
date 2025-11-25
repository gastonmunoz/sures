import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

const STORAGE_KEY = 'sures_favorites';

export interface UseFavoritesReturn {
  favorites: Product[];
  favoriteIds: Set<string>;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        setFavoriteIds(new Set(ids));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favoriteIds)));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favoriteIds]);

  const addFavorite = useCallback((productId: string) => {
    setFavoriteIds(prev => new Set([...prev, productId]));
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);

  const clearFavorites = useCallback(() => {
    setFavoriteIds(new Set());
  }, []);

  // Get full product objects for favorites
  const favorites = PRODUCTS.filter(p => favoriteIds.has(p.id));

  return {
    favorites,
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favoriteIds.size,
  };
};

export default useFavorites;

