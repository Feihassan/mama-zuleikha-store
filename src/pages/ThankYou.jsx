import { Link } from "react-router-dom";

function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
         Thank You for Your Order!
      </h1>
      <p className="text-gray-700 mb-6 max-w-md">
        We've received your order and are preparing it with care. A confirmation has been sent to your email.
      </p>
      <Link
        to="/products"
        className="bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default ThankYou;
