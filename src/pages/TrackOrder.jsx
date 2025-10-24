import { useState } from 'react';

function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId.trim()}`);
      
      if (response.status === 404) {
        setOrder(null);
        setNotFound(true);
      } else if (!response.ok) {
        throw new Error('Failed to fetch order');
      } else {
        const foundOrder = await response.json();
        setOrder(foundOrder);
        setNotFound(false);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setOrder(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment': return 'text-yellow-600 bg-yellow-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-700 bg-green-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_payment': return 'Pending Payment';
      case 'paid': return 'Payment Confirmed';
      case 'confirmed': return 'Order Confirmed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">Track Your Order</h1>
      
      {/* Search Form */}
      <form onSubmit={handleTrack} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your order ID"
            className="flex-1 border rounded-l-full px-4 py-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-r-full hover:bg-pink-700 transition disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
      </form>

      {/* Not Found Message */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">
            Order not found. Please check your order ID and try again.
          </p>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Delivery Information</h3>
            <p className="text-gray-700">{order.customer_name}</p>
            <p className="text-gray-700">{order.customer_email}</p>
            <p className="text-gray-700">{order.customer_phone}</p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 mb-2">Order contains multiple items</p>
              <div className="flex justify-between items-center pt-2 font-semibold text-lg border-t">
                <span>Total Amount</span>
                <span>Ksh {order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Payment Information</h3>
            <p className="text-gray-700">
              Payment Method: M-Pesa
            </p>
            {order.mpesa_checkout_id && (
              <p className="text-sm text-gray-600">
                M-Pesa Reference: {order.mpesa_checkout_id}
              </p>
            )}
          </div>

          {/* Order Status Timeline */}
          <div>
            <h3 className="font-semibold mb-3">Order Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Order Placed</span>
              </div>
              {order.status !== 'pending_payment' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Payment Confirmed</span>
                </div>
              )}
              {['processing', 'shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Order Processing</span>
                </div>
              )}
              {['shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Order Shipped</span>
                </div>
              )}
              {order.status === 'delivered' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Order Delivered</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;