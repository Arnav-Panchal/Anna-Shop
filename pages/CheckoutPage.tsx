
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { processPayment } from '../services/razorpayService';

const CheckoutPage: React.FC = () => {
  const { cartTotal, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (cartCount === 0 && !isProcessing) {
      navigate('/');
      return null;
  }

  const handlePayment = () => {
    setIsProcessing(true);
    
    const onPaymentSuccess = (paymentId: string) => {
        alert(`Payment successful! Payment ID: ${paymentId}`);
        clearCart();
        setIsProcessing(false);
        navigate('/');
    };
    
    const onPaymentFailure = () => {
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
    };

    processPayment(cartTotal, user, onPaymentSuccess, onPaymentFailure);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Checkout</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Shipping Details Form (Mock) */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" value={user?.name || ''} className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" readOnly />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" value={user?.email || ''} className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" readOnly />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" defaultValue="123 Gemini Lane, React City" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" readOnly />
                    </div>
                </form>
            </div>

            {/* Order Summary */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 bg-gray-50 p-6 rounded-md">
                    <div className="flex justify-between text-lg">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-lg">
                        <span>Shipping</span>
                        <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
                 <button
                    onClick={handlePayment}
                    disabled={isProcessing || !user}
                    className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors shadow-lg text-lg"
                >
                    {isProcessing ? 'Processing...' : `Pay with Razorpay`}
                </button>
            </div>
        </div>
    </div>
  );
};

export default CheckoutPage;
