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
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 200; // Free shipping over Ksh 2000
  const total = subtotal + shipping;

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=4');
        if (response.ok) {
          const data = await response.json();
          setRelatedProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, []);



  if (cartItems.length === 0) {
    return (
      <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="text-gray-500 text-sm font-medium leading-normal hover:text-primary transition-colors">Home</Link>
            <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
            <span className="text-gray-900 text-sm font-medium leading-normal">Cart</span>
          </div>
          
          {/* Empty Cart Message */}
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex flex-col gap-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2">
          <Link to="/" className="text-gray-500 text-sm font-medium leading-normal hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
          <span className="text-gray-900 text-sm font-medium leading-normal">Cart</span>
        </div>
        
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3">
          <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Your Cart ({cartItems.length} items)
          </p>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 justify-between items-center">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px] flex-shrink-0"
                      style={{ backgroundImage: `url(${item.image_url})` }}
                    ></div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-base font-medium leading-normal">{item.name}</p>
                      <p className="text-gray-500 text-sm font-normal leading-normal">${parseFloat(item.price).toFixed(2)}</p>
                      <p className="text-gray-500 text-sm font-normal leading-normal">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="shrink-0">
                      <div className="flex items-center gap-2 text-gray-900">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          -
                        </button>
                        <input 
                          className="text-base font-medium leading-normal w-4 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none" 
                          type="number" 
                          value={item.quantity}
                          readOnly
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 text-xs font-medium hover:text-primary transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-bold">Order Summary</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-medium">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Shipping</p>
                  <p className="font-medium">Calculated at next step</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Taxes</p>
                  <p className="font-medium">Calculated at next step</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-sm text-gray-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-gray-300 bg-gray-50 h-11 placeholder:text-gray-500 px-3" 
                    placeholder="Promo Code" 
                  />
                  <button className="flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm font-bold leading-normal tracking-[-0.015em] min-w-0 px-4 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              <div className="w-full h-px bg-gray-200"></div>
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link 
                  to="/checkout"
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[-0.015em] min-w-0 px-6 hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  to="/products"
                  className="w-full text-center text-primary text-sm font-bold leading-normal hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* You might also like Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="flex flex-col gap-3 group">
                <div className="relative overflow-hidden rounded-lg">
                  <div 
                    className="bg-center bg-no-repeat aspect-[3/4] bg-cover"
                    style={{ backgroundImage: `url(${product.image_url})` }}
                  ></div>
                  <button className="absolute bottom-3 right-3 flex cursor-pointer items-center justify-center size-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <span className="text-2xl">🛒</span>
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-500">${parseFloat(product.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
