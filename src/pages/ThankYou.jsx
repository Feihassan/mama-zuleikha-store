import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

function ThankYou() {
  const location = useLocation();
  const { orderId, paymentPending } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [isChecking, setIsChecking] = useState(false);

  const checkPaymentStatus = async () => {
    if (!paymentPending || !orderId) return;
    
    setIsChecking(true);
    try {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const order = orders.find(o => o.id === orderId);
      
      if (order?.checkoutRequestId) {
        const response = await fetch(`http://localhost:3000/api/mpesa/query/${order.checkoutRequestId}`);
        
        if (!response.ok) {
          throw new Error('Unable to check payment status');
        }
        
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
      setPaymentStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

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
      case 'error':
        return (
          <div className="bg-orange-50 border border-orange-200 rounded p-4 text-sm text-orange-800">
            <p className="font-semibold mb-1">⚠️ Unable to Check Status</p>
            <p>We couldn't verify your payment status. Please try again or contact support if you completed the payment.</p>
          </div>
        );
      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
            <p className="font-semibold mb-1">⏳ Payment Initiated</p>
            <p className="mb-3">Please complete the M-Pesa payment on your phone, then click the button below to verify.</p>
            <button
              onClick={checkPaymentStatus}
              disabled={isChecking}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isChecking ? 'Checking...' : 'Check Payment Status'}
            </button>
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
