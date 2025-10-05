import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    setAllOrders(orders);
    
    if (orderId) {
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment': return 'text-yellow-600 bg-yellow-50';
      case 'paid': 
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'preparing': return 'text-blue-600 bg-blue-50';
      case 'shipped': return 'text-purple-600 bg-purple-50';
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_payment': return 'Pending Payment';
      case 'paid': return 'Payment Confirmed';
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Preparing Order';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (orderId && !order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary">Order Not Found</h1>
        <p className="text-gray-600 mb-4">Order #{orderId} was not found.</p>
        <Link to="/track" className="text-primary hover:underline">← Back to Order Tracking</Link>
      </div>
    );
  }

  if (orderId && order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link to="/track" className="text-primary hover:underline">← Back to Order Tracking</Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-primary">Order #{order.id}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Order Details</h3>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Total:</strong> Ksh {order.total}</p>
              <p><strong>Payment:</strong> {order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Delivery Information</h3>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              <p><strong>Address:</strong> {order.customer.address}</p>
              <p><strong>City:</strong> {order.customer.city}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-12 h-12 rounded" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">Ksh {item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Track Your Orders</h1>
      
      {allOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No orders found.</p>
          <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                  <p className="text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                  <p className="font-semibold">Ksh {order.total}</p>
                </div>
                <Link 
                  to={`/track/${order.id}`}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderTracking;