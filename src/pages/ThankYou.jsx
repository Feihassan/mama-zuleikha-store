import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function ThankYou() {
  const location = useLocation();
  const { orderId, paymentPending } = location.state || {};

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-800 mb-4">Thank You!</h1>
        <p className="text-lg text-green-700 mb-4">
          Your order has been successfully placed and is being processed.
        </p>
        {orderId && (
          <p className="text-gray-700 mb-4">
            <strong>Order ID:</strong> {orderId}
          </p>
        )}
        {paymentPending && (
          <p className="text-yellow-700 bg-yellow-100 p-3 rounded mb-4">
            ⏳ Payment confirmation pending. Please complete the M-Pesa payment on your phone.
          </p>
        )}
        <p className="text-gray-600 mb-8">
          You will receive a confirmation email shortly with your order details.
        </p>
      </div>
      
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition mr-4"
        >
          Continue Shopping
        </Link>
        <Link
          to="/track"
          className="inline-block border border-primary text-primary px-6 py-3 rounded-full hover:bg-pink-50 transition"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}

export default ThankYou;