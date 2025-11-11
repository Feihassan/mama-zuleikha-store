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
      const response = await fetch(`/api/orders/${orderId.trim()}`);

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
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-700 bg-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Order Placed - Awaiting Processing';
      case 'processing': return 'Processing - Preparing Your Order';
      case 'shipped': return 'Shipped - On The Way';
      case 'delivered': return 'Delivered - Order Complete';
      case 'cancelled': return 'Cancelled';
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
            className="bg-primary text-white px-6 py-3 rounded-r-full hover:bg-secondary transition disabled:opacity-50"
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
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="space-y-2 mb-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-gray-700">{item.product_name}</span>
                      <span className="text-gray-600">x{item.quantity} - Ksh {item.price * item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Your order includes beauty and wellness products</p>
                )}
              </div>
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
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${order.status !== 'cancelled' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div>
                  <span className="text-sm font-medium">Order Placed</span>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>

              {['processing', 'shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <span className="text-sm font-medium">Processing</span>
                    <p className="text-xs text-gray-500">Your order is being prepared</p>
                  </div>
                </div>
              )}

              {['shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <span className="text-sm font-medium">Shipped</span>
                    <p className="text-xs text-gray-500">Your order is on the way</p>
                  </div>
                </div>
              )}

              {order.status === 'delivered' && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div>
                    <span className="text-sm font-medium">Delivered</span>
                    <p className="text-xs text-gray-500">Order completed successfully</p>
                  </div>
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div>
                    <span className="text-sm font-medium text-red-600">Order Cancelled</span>
                    <p className="text-xs text-gray-500">This order has been cancelled</p>
                  </div>
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