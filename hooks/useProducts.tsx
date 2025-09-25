
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: new Date().getTime().toString(),
      rating: Math.floor(Math.random() * 2) + 3.5, // 3.5 to 4.5
      reviewCount: Math.floor(Math.random() * 100),
    };
    setProducts(prevProducts => {
        const updatedProducts = [...prevProducts, newProduct];
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        return updatedProducts;
    });
  };
    
  const getProductById = (id: string): Product | undefined => {
      return products.find(p => p.id === id);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
