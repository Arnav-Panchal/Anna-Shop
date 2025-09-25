import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { getProductById } = useProducts();

  if (cartCount === 0) {
    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.map(item => {
            const product = getProductById(item.id);
            const variant = product?.variants?.find(v => v.size === item.size);
            const maxStock = variant ? variant.stock : product?.stock || 0;

            return (
              <div key={item.cartId} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100" disabled={item.quantity >= maxStock}>+</button>
                  </div>
                  <p className="font-semibold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 font-bold text-xl leading-none p-1">
                    &times;
                  </button>
                </div>
              </div>
            )
        })}
      </div>
      <div className="mt-8 flex justify-end items-center">
        <div className="text-right">
          <p className="text-2xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
          <p className="text-gray-500">Shipping calculated at next step.</p>
        </div>
      </div>
       <div className="mt-6 flex justify-end">
        <Link to="/checkout" className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
