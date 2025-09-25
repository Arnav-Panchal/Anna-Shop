
import React from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const HomePage: React.FC = () => {
  const { products } = useProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
