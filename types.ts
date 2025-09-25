export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  cartId: string; // A unique identifier for the cart item (e.g., product.id-size)
  size?: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  contact?: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    order_id: string;
    handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    notes: {
        address: string;
    };
    theme: {
        color: string;
    };
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
        };
    }
}
