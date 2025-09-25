import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string) => string | null;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);
  
  const updateLocalStorage = (updatedCart: CartItem[]) => {
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  const addToCart = (product: Product, quantity: number, size?: string): string | null => {
    const cartId = size ? `${product.id}-${size}` : product.id;
    const existingItem = cart.find(item => item.cartId === cartId);

    let variant: ProductVariant | undefined;
    if (size && product.variants) {
      variant = product.variants.find(v => v.size === size);
    }
    const maxStock = variant ? variant.stock : product.stock || 0;
    
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    if (quantity + currentQuantityInCart > maxStock) {
        return `Cannot add to cart. Only ${maxStock} items in stock.`;
    }

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item
      );
      updateLocalStorage(updatedCart);
    } else {
      const newItem: CartItem = { 
          ...product, 
          quantity, 
          size,
          cartId
      };
      const updatedCart = [...cart, newItem];
      updateLocalStorage(updatedCart);
    }
    return null; // Success
  };

  const removeFromCart = (cartId: string) => {
    const updatedCart = cart.filter(item => item.cartId !== cartId);
    updateLocalStorage(updatedCart);
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
    } else {
      const updatedCart = cart.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      );
      updateLocalStorage(updatedCart);
    }
  };

  const clearCart = () => {
    updateLocalStorage([]);
  };
  
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
