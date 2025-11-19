import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "Kenya",
    mpesaPhone: ""
  });



  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const total = subtotal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^254\d{9}$/.test(form.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid Kenyan phone number (254XXXXXXXXX)';
    }
    if (!form.mpesaPhone.trim()) {
      newErrors.mpesaPhone = 'M-Pesa phone number is required';
    } else if (!/^254\d{9}$/.test(form.mpesaPhone.replace(/\s+/g, ''))) {
      newErrors.mpesaPhone = 'Please enter a valid M-Pesa phone number (254XXXXXXXXX)';
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

    setLoading(true);

    try {
      // Create WhatsApp message
      const orderSummary = cart.map(item => 
        `${item.name} - Qty: ${item.quantity} - $${parseFloat(item.price).toFixed(2)}`
      ).join('\n');
      
      const whatsappMessage = `New Order Request:\n\nCustomer: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}\nAddress: ${form.address}, ${form.city}, ${form.country}\n\nOrder Details:\n${orderSummary}\n\nTotal: $${total.toFixed(2)}\nM-Pesa Phone: ${form.mpesaPhone}\n\nPlease confirm this order and send M-Pesa payment request.`;
      
      // Open WhatsApp with pre-filled message
      const whatsappUrl = `https://wa.me/254727109399?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      // Submit order to backend
      const orderData = {
        items: cart,
        customer: {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone
        },
        delivery: {
          address: form.address,
          city: form.city,
          country: form.country
        },
        payment: {
          method: 'mpesa',
          mpesaPhone: form.mpesaPhone
        },
        totals: {
          subtotal,
          total
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Order submitted! Please complete payment via WhatsApp.");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event('cartUpdated'));
        navigate("/thank-you", { state: { orderId: result.orderId, whatsapp: true } });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto flex-grow px-6 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">Secure Checkout</p>
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <span className="text-base">🔒</span>
              SSL Encrypted
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            <Link to="/cart" className="text-primary text-base font-medium leading-normal">Cart</Link>
            <span className="text-gray-500 text-base font-medium leading-normal">/</span>
            <span className="text-gray-900 text-base font-medium leading-normal">Checkout</span>
            <span className="text-gray-500 text-base font-medium leading-normal">/</span>
            <span className="text-gray-500 text-base font-medium leading-normal">WhatsApp</span>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Contact & Delivery Accordion */}
            <details className="flex flex-col rounded-xl border border-gray-300 bg-white px-5 py-2 group shadow-sm" open>
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-3">
                <p className="text-gray-900 text-lg font-bold leading-normal">1. Contact & Delivery Details</p>
                <span className="text-gray-900 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pb-4 pt-2">
                <p className="text-gray-500 text-sm font-normal leading-normal mb-6">Please enter your contact and delivery details below.</p>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="email">Email Address</label>
                    <input 
                      className={`w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition ${errors.email ? 'border-red-500' : ''}`}
                      id="email" 
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com" 
                      type="email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="first-name">First Name</label>
                    <input 
                      className={`w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition ${errors.firstName ? 'border-red-500' : ''}`}
                      id="first-name" 
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Jane" 
                      type="text"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="last-name">Last Name</label>
                    <input 
                      className={`w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition ${errors.lastName ? 'border-red-500' : ''}`}
                      id="last-name" 
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe" 
                      type="text"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="address">Delivery Address</label>
                    <input 
                      className={`w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition ${errors.address ? 'border-red-500' : ''}`}
                      id="address" 
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="123 Blossom Lane, Westlands" 
                      type="text"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="city">City</label>
                    <input 
                      className={`w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition ${errors.city ? 'border-red-500' : ''}`}
                      id="city" 
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Nairobi" 
                      type="text"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="country">Country</label>
                    <select 
                      className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition" 
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                    >
                      <option>Kenya</option>
                      <option>Uganda</option>
                      <option>Tanzania</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="phone">Phone Number</label>
                    <input 
                      className={`w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition ${errors.phone ? 'border-red-500' : ''}`}
                      id="phone" 
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="254700000000" 
                      type="tel"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </form>
              </div>
            </details>
            

            
            {/* M-Pesa Payment Accordion */}
            <details className="flex flex-col rounded-xl border border-gray-300 bg-white px-5 py-2 group shadow-sm" open>
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-3">
                <p className="text-gray-900 text-lg font-bold leading-normal">2. M-Pesa Payment</p>
                <span className="text-gray-900 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pb-4 pt-2">
                <p className="text-gray-500 text-sm font-normal leading-normal mb-6">Pay securely with M-Pesa. You'll receive a payment request on your phone.</p>
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📱</span>
                    <span className="font-semibold text-gray-900">M-Pesa Payment</span>
                    <span className="ml-auto bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">SELECTED</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="mpesa-phone">M-Pesa Phone Number</label>
                    <input 
                      className={`w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition ${errors.mpesaPhone ? 'border-red-500' : ''}`}
                      id="mpesa-phone" 
                      name="mpesaPhone"
                      value={form.mpesaPhone}
                      onChange={handleChange}
                      placeholder="254700000000" 
                      type="tel"
                    />
                    {errors.mpesaPhone && <p className="text-red-500 text-sm mt-1">{errors.mpesaPhone}</p>}
                    <p className="text-xs text-gray-500 mt-1">Enter the phone number registered with M-Pesa</p>
                  </div>
                </div>
              </div>
            </details>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">💬</span>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">WhatsApp Order Process</h4>
                  <p className="text-sm text-blue-700">After clicking "Place Order", you'll be redirected to WhatsApp where our team will:</p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Confirm your order details</li>
                    <li>• Send M-Pesa payment request</li>
                    <li>• Arrange delivery within Nairobi</li>
                    <li>• Provide order tracking updates</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4 mt-4">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-green-600 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] px-8 hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <span>💬</span>
                    Place Order via WhatsApp
                  </>
                )}
              </button>
              <Link 
                to="/cart"
                className="text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <span>←</span>
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-10">
            <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6 lg:p-8">
              <h3 className="text-gray-900 text-2xl font-bold leading-tight tracking-[-0.015em] mb-6">Your Order</h3>
              <div className="space-y-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img className="w-16 h-16 rounded-lg object-cover" src={item.image_url} alt={item.name} />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 my-6"></div>
              <div className="flex gap-3">
                <input 
                  className="flex-grow rounded-lg border-gray-300 focus:ring-primary focus:border-primary transition" 
                  placeholder="Discount code" 
                  type="text"
                />
                <button className="flex-shrink-0 cursor-pointer items-center justify-center rounded-lg h-11 bg-primary/20 text-gray-900 text-sm font-bold px-4 hover:bg-primary/30 transition-colors">
                  Apply
                </button>
              </div>
              <div className="border-t border-gray-300 my-6"></div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <span>📱</span>
                    <span className="text-sm font-medium">Free delivery within Nairobi</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Orders processed via WhatsApp for personalized service</p>
                </div>
              </div>
              <div className="border-t border-gray-300 my-6"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900 tracking-tight">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;