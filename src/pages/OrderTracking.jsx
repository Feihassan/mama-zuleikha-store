import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast"; // eslint-disable-line no-unused-vars
import LoadingSpinner from "../components/LoadingSpinner";

function OrderTracking() {
  const { orderId } = useParams();
  const [trackingId, setTrackingId] = useState(orderId || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      trackOrder(orderId);
    }
  }, [orderId, trackOrder]);

  const trackOrder = useCallback(async (id = trackingId) => {
    if (!id.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/orders/${id}`);

      if (response.ok) {
        const orderData = await response.json();

        // Transform the order data to include timeline
        const transformedOrder = {
          ...orderData,
          timeline: generateTimeline(orderData.status, orderData.created_at)
        };

        setOrder(transformedOrder);
      } else {
        setError("Order not found. Please check your order ID.");
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [trackingId]);

  const generateTimeline = (currentStatus, createdAt) => {
    const statuses = [
      { key: 'pending', label: 'Order Placed', completed: true },
      { key: 'processing', label: 'Processing', completed: false },
      { key: 'shipped', label: 'Shipped', completed: false },
      { key: 'delivered', label: 'Delivered', completed: false }
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return statuses.map((status, index) => ({
      ...status,
      completed: index <= currentIndex || currentStatus === 'cancelled',
      date: index === 0 ? new Date(createdAt).toLocaleString() : 
            (index <= currentIndex ? 'Completed' : '')
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600";
      case "processing":
        return "text-blue-600";
      case "shipped":
        return "text-purple-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-12 pt-24">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-8 text-center">
        Track Your Order
      </h1>

      {/* Order ID Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter your order ID (e.g., 1, 2, 3...)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={() => trackOrder()}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Tracking...</span>
              </>
            ) : (
              "Track Order"
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Order Details */}
      {order && (
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order #{order.id}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Customer Information
                </h3>
                <p className="text-gray-600">{order.customer_name}</p>
                <p className="text-gray-600">{order.customer_email}</p>
                <p className="text-gray-600">{order.customer_phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Order Status
                </h3>
                <p className={`font-bold text-lg ${getStatusColor(order.status)}`}>
                  {order.status?.toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {item.product_name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    Ksh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  Ksh {parseFloat(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-6">Order Timeline</h3>
            <div className="space-y-4">
              {order.timeline?.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      step.completed
                        ? "bg-green-500"
                        : "bg-gray-300 border-2 border-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        step.completed ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-sm text-gray-500">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;