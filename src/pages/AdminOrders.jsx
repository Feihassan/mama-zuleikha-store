import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved.reverse()); // show most recent first
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">📋 Admin Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="border rounded-lg p-4 mb-6 shadow-sm bg-white">
            <div className="mb-2 text-sm text-gray-500">
              <strong>Date:</strong>{" "}
              {new Date(order.date).toLocaleString()}
            </div>
            <div className="mb-2">
              <strong>Customer:</strong> {order.customer.name} |{" "}
              {order.customer.email}
              <br />
              <strong>Address:</strong> {order.customer.address}
            </div>
            <ul className="pl-4 mb-2 list-disc text-sm">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.title} x {item.quantity} — Ksh{" "}
                  {item.price * item.quantity}
                </li>
              ))}
            </ul>
            <div className="font-bold text-right">Total: Ksh {order.total}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
