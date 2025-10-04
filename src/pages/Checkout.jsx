import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "mpesa"
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleanPhone = form.phone.replace(/\s+/g, '');
      if (!/^(\+?254|0)[17]\d{8}$/.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid Kenyan phone number (e.g., 0712345678)';
      }
    }
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      if (form.paymentMethod === 'mpesa') {
        // Format phone number for M-Pesa
        let phoneNumber = form.phone.replace(/[\s+\-()]/g, '');
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '254' + phoneNumber.substring(1);
        } else if (phoneNumber.startsWith('254')) {
          // Already in correct format
        } else if (/^[17]\d{8}$/.test(phoneNumber)) {
          phoneNumber = '254' + phoneNumber;
        } else {
          throw new Error('Invalid phone number format');
        }

        // Initiate M-Pesa STK push
        const mpesaResponse = await fetch('http://localhost:3000/api/mpesa/stkpush', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: phoneNumber,
            amount: total
          })
        });

        if (!mpesaResponse.ok) {
          const errorData = await mpesaResponse.json();
          throw new Error(errorData.error || 'Server error');
        }

        const mpesaData = await mpesaResponse.json();

        if (mpesaData.ResponseCode === '0') {
          toast.success("Payment prompt sent to your phone. Please complete the payment.");
          
          // Create order with pending payment status
          const order = {
            id: Date.now().toString(),
            items: cart,
            customer: form,
            total,
            status: 'pending_payment',
            paymentMethod: 'mpesa',
            checkoutRequestId: mpesaData.CheckoutRequestID,
            date: new Date().toISOString(),
          };

          const orders = JSON.parse(localStorage.getItem("orders")) || [];
          orders.push(order);
          localStorage.setItem("orders", JSON.stringify(orders));

          localStorage.removeItem("cart");
          navigate("/thank-you", { state: { orderId: order.id, paymentPending: true } });
        } else {
          throw new Error(mpesaData.errorMessage || 'Failed to initiate payment');
        }
      } else {
        // Cash on delivery - no payment processing needed
        const order = {
          id: Date.now().toString(),
          items: cart,
          customer: form,
          total,
          status: 'confirmed',
          paymentMethod: 'cod',
          date: new Date().toISOString(),
        };

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        localStorage.removeItem("cart");
        toast.success("Order placed successfully!");
        navigate("/thank-you", { state: { orderId: order.id } });
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order. Please try again.");
      console.error('Order submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-2xl font-bold mb-6 text-primary">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Customer Info */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0712345678 or 254712345678"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">City *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nairobi"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Delivery Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              rows="3"
              placeholder="Enter your full delivery address"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="mpesa">M-Pesa</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          
          {form.paymentMethod === 'mpesa' && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="font-semibold text-green-800 mb-2">M-Pesa Payment</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Amount:</strong> Ksh {total}</p>
                <p className="mt-2 text-xs">Click "Place Order" to receive payment prompt on your phone</p>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Processing Order...</span>
              </>
            ) : (
              `Place Order - Ksh ${total}`
            )}
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
