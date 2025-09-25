import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import StarRating from '../components/StarRating';
import NotFoundPage from './NotFoundPage';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!id) {
    return <NotFoundPage />;
  }
  const product = getProductById(id);

  if (!product) {
    return <NotFoundPage />;
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const selectedVariant = hasVariants && selectedSize ? product.variants!.find(v => v.size === selectedSize) : null;
  const maxStock = selectedVariant ? selectedVariant.stock : product.stock || 0;
  
  const handleAddToCart = () => {
      if (hasVariants && !selectedSize) {
          setError("Please select a size.");
          return;
      }
      if (quantity > maxStock) {
          setError(`Only ${maxStock} items in stock.`);
          return;
      }
      
      const errorMessage = addToCart(product, quantity, selectedSize || undefined);
      if (errorMessage) {
          setError(errorMessage);
      } else {
          setError(null);
          // Optional: navigate to cart or show success message
          navigate('/cart');
      }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setQuantity(1); // Reset quantity when size changes
    setError(null);
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-md aspect-square object-cover" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="mb-4">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
          
          {hasVariants && (
              <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                      {product.variants!.map(variant => (
                          <button key={variant.size} onClick={() => handleSizeChange(variant.size)}
                              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedSize === variant.size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'}`}
                              disabled={variant.stock === 0}
                          >
                              {variant.size}
                          </button>
                      ))}
                  </div>
              </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="flex items-center border rounded-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors">-</button>
                <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center border-x" min="1" max={maxStock} />
                <button onClick={() => setQuantity(q => Math.min(maxStock, q + 1))} className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors" disabled={quantity >= maxStock}>+</button>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex items-center justify-between mt-auto">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              disabled={(hasVariants && !selectedSize) || maxStock === 0}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {maxStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
