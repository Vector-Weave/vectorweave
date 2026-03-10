import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import { cartService } from '@/services/cartService';
import { getUser, isAuthenticated } from '@/lib/auth';

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCartCount = async () => {
    setIsLoading(true);
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        setCartCount(0);
        return;
      }

      const user = await getUser();
      if (user) {
        const cart = await cartService.getCart(user.id);
        setCartCount(cart.itemCount);
      }
    } catch (error) {
      console.error('Failed to load cart count:', error);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
