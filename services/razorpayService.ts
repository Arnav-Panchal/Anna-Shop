
import { RazorpayOptions, User } from '../types';

export const processPayment = (
    totalAmount: number,
    user: User | null, // Accept a user object
    onSuccess: (paymentId: string) => void,
    onFailure: () => void
) => {
    // In a real application, you would first call your backend to create a Razorpay order.
    // The backend would return an order_id. We'll simulate this.
    const simulatedOrderId = `order_${new Date().getTime()}`;

    const options: RazorpayOptions = {
        key: 'rzp_test_YOUR_KEY', // This is a public test key.
        amount: totalAmount * 100, // Amount is in currency subunits. (e.g., paise for INR)
        currency: "INR",
        name: "Gemini Storefront",
        description: "Test Transaction",
        image: "https://picsum.photos/seed/logo/128/128",
        order_id: simulatedOrderId,
        handler: (response) => {
            console.log("Payment successful:", response);
            // Here you would verify the payment signature on your backend.
            // For this simulation, we'll assume it's successful.
            onSuccess(response.razorpay_payment_id);
        },
        prefill: {
            name: user?.name || "Test User",
            email: user?.email || "test.user@example.com",
            contact: user?.contact || "9999999999"
        },
        notes: {
            address: "Test Corporate Office"
        },
        theme: {
            color: "#3399cc"
        }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch(error) {
       console.error("Razorpay Error:", error);
       // This can happen if the script fails to load or is blocked.
       // We'll simulate a failure.
       alert("Could not connect to payment gateway. Please try again later.");
       onFailure();
    }
};
