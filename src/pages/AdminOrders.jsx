import { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchOrders();
  }, [navigate, fetchOrders]);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/admin/login');
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refresh orders
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this cancelled order? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Order deleted successfully');
        fetchOrders(); // Refresh orders
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">📋 Admin Orders</h1>
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Manage Products
          </button>
        </div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">📋 Admin Orders</h1>
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Manage Products
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Pending ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('processing')}
          className={`px-4 py-2 rounded ${filter === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Processing ({orders.filter(o => o.status === 'processing').length})
        </button>
        <button
          onClick={() => setFilter('shipped')}
          className={`px-4 py-2 rounded ${filter === 'shipped' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Shipped ({orders.filter(o => o.status === 'shipped').length})
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`px-4 py-2 rounded ${filter === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Delivered ({orders.filter(o => o.status === 'delivered').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Cancelled ({orders.filter(o => o.status === 'cancelled').length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 mb-6 shadow-sm bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="mb-2 text-sm text-gray-500">
                  <strong>Order #{order.id}</strong> • {new Date(order.created_at).toLocaleString()}
                </div>
                <div className="mb-2">
                  <strong>Customer:</strong> {order.customer_name} | {order.customer_email}
                  <br />
                  <strong>Phone:</strong> {order.customer_phone}
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <strong>Status:</strong>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  {order.mpesa_checkout_id && (
                    <span className="text-sm text-gray-600">
                      • M-Pesa ID: {order.mpesa_checkout_id}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="flex flex-col gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {order.status === 'cancelled' && (
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete Order
                  </button>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Order Items:</h4>
              <ul className="space-y-1 text-sm">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.product_name} x {item.quantity}</span>
                    <span>Ksh {item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="font-bold text-right text-lg mt-2 pt-2 border-t">
                Total: Ksh {order.total_amount}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
