import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

function ThankYou() {
  const location = useLocation();
  const { orderId, paymentPending } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState('checking');

  useEffect(() => {
    if (paymentPending && orderId) {
      const checkPayment = async () => {
        try {
          const orders = JSON.parse(localStorage.getItem('orders')) || [];
          const order = orders.find(o => o.id === orderId);
          
          if (order?.checkoutRequestId) {
            const response = await fetch(`http://localhost:3000/api/mpesa/query/${order.checkoutRequestId}`);
            const data = await response.json();
            
            if (data.ResultCode === '0') {
              const updatedOrders = orders.map(o => 
                o.id === orderId ? { ...o, status: 'paid', transactionId: data.MpesaReceiptNumber } : o
              );
              localStorage.setItem('orders', JSON.stringify(updatedOrders));
              setPaymentStatus('completed');
            } else if (data.ResultCode === '1032') {
              setPaymentStatus('cancelled');
            } else {
              setPaymentStatus('failed');
            }
          }
        } catch (error) {
          console.error('Payment check error:', error);
        }
      };

      const interval = setInterval(checkPayment, 5000);
      checkPayment();
      return () => clearInterval(interval);
    }
  }, [orderId, paymentPending]);

  const renderPaymentStatus = () => {
    if (!paymentPending) return null;

    switch (paymentStatus) {
      case 'completed':
        return (
          <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
            <p className="font-semibold mb-1">✅ Payment Successful</p>
            <p>Your payment has been confirmed. We'll start preparing your order.</p>
          </div>
        );
      case 'failed':
        return (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-800">
            <p className="font-semibold mb-1">❌ Payment Failed</p>
            <p>Payment was not completed. Please try placing your order again.</p>
          </div>
        );
      case 'cancelled':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-800">
            <p className="font-semibold mb-1">⏹️ Payment Cancelled</p>
            <p>You cancelled the payment. Your order has not been confirmed.</p>
          </div>
        );
      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
            <p className="font-semibold mb-1">⏳ Checking Payment Status...</p>
            <p>Please complete the M-Pesa payment on your phone.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
         Thank You for Your Order!
      </h1>
      
      {paymentPending ? (
        <div className="mb-6 max-w-md">
          <p className="text-gray-700 mb-4">
            Order #{orderId} has been created.
          </p>
          {renderPaymentStatus()}
        </div>
      ) : (
        <p className="text-gray-700 mb-6 max-w-md">
          We've received your order #{orderId} and are preparing it with care.
        </p>
      )}
      
      <Link
        to="/products"
        className="bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default ThankYou;
