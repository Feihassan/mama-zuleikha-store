import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
    );
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-primary">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-4">
              <div className="flex gap-4 items-center">
                <img src={item.image} alt={item.title} className="w-24 h-24 rounded" />
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">Ksh {item.price}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total and Checkout Button */}
          <div className="text-right mt-6">
            <h2 className="text-xl font-bold mb-4">Total: Ksh {total}</h2>
            <Link
              to="/checkout"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
