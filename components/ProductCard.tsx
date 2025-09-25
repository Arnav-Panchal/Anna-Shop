import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const hasVariants = product.variants && product.variants.length > 0;
  
  // A product without variants is out of stock if its stock is 0 or undefined.
  // For a product with variants, we assume it's in stock on the card, 
  // and let the product page handle the detailed stock check.
  const isOutOfStock = !hasVariants && !product.stock;

  const handleButtonClick = () => {
    if (hasVariants) {
      navigate(`/product/${product.id}`);
    } else if (!isOutOfStock) {
      const errorMessage = addToCart(product, 1);
      if (errorMessage) {
        // Simple feedback for now if adding fails (e.g., another user bought the last item)
        alert(errorMessage);
      }
    }
  };

  const getButtonText = () => {
    if (isOutOfStock) return 'Out of Stock';
    if (hasVariants) return 'Select Options';
    return 'Add to Cart';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link to={`/product/${product.id}`}>
        <img className="w-full h-56 object-cover" src={product.imageUrl} alt={product.name} />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="mt-2 mb-4">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="flex items-center justify-between mt-auto pt-4">
          <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          <button
            onClick={handleButtonClick}
            disabled={isOutOfStock}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
