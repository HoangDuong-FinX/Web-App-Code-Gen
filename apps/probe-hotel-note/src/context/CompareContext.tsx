import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Car } from '../types';

interface CompareContextValue {
  compareList: Car[];
  addToCompare: (car: Car) => boolean;
  removeFromCompare: (carId: string) => void;
  isInCompare: (carId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue>({
  compareList: [],
  addToCompare: () => false,
  removeFromCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
});

export function CompareProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [compareList, setCompareList] = useState<Car[]>([]);

  const addToCompare = useCallback((car: Car): boolean => {
    let added = false;
    setCompareList(prev => {
      if (prev.length >= 3) return prev;
      if (prev.some(c => c.id === car.id)) return prev;
      added = true;
      return [...prev, car];
    });
    return added;
  }, []);

  const removeFromCompare = useCallback((carId: string) => {
    setCompareList(prev => prev.filter(c => c.id !== carId));
  }, []);

  const isInCompare = useCallback((carId: string): boolean => {
    return compareList.some(c => c.id === carId);
  }, [compareList]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  return useContext(CompareContext);
}
