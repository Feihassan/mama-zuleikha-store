import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      toast.error("Please fill in all fields.");
      return;
    }

    const order = {
      items: cart,
      customer: form,
      total,
      date: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");
    navigate("/thank-you");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-2xl font-bold mb-6 text-primary">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Customer Info */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.title} x {item.quantity}
                  </span>
                  <span>Ksh {item.price * item.quantity}</span>
                </li>
              ))}
              <li className="flex justify-between font-semibold pt-4 border-t">
                <span>Total</span>
                <span>Ksh {total}</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
