import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Tea } from '../types';

const CART_STORAGE_KEY = 'tea-shop-cart';

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (tea: Tea) => void;
  updateQuantity: (teaId: string, quantity: number) => void;
  removeFromCart: (teaId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) {
      return [];
    }

    try {
      const parsed = JSON.parse(saved) as CartItem[];
      return parsed.filter(item => item.quantity > 0);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    addToCart: tea => {
      setItems(current => {
        const existing = current.find(item => item.teaId === tea._id);
        if (existing) {
          return current.map(item =>
            item.teaId === tea._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }

        return [
          ...current,
          {
            teaId: tea._id,
            slug: tea.slug,
            name: tea.name,
            price: tea.price,
            image: tea.image,
            quantity: 1
          }
        ];
      });
    },
    updateQuantity: (teaId, quantity) => {
      setItems(current =>
        current
          .map(item => (item.teaId === teaId ? { ...item, quantity } : item))
          .filter(item => item.quantity > 0)
      );
    },
    removeFromCart: teaId => {
      setItems(current => current.filter(item => item.teaId !== teaId));
    },
    clearCart: () => setItems([])
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart має використовуватися всередині CartProvider');
  }
  return context;
}
