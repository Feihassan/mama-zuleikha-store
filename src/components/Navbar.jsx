import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* 👇 Smaller logo text with tracking */}
        <Link to="/" className="text-sm sm:text-base font-semibold text-primary tracking-tight">
          Mama Zulekha
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-primary dark:text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-6 items-center">
          <Link to="/" className="text-primary dark:text-white hover:underline">
            Home
          </Link>
          <Link to="/products" className="text-primary dark:text-white hover:underline">
            Products
          </Link>
          <Link to="/cart" className="relative text-primary dark:text-white hover:underline">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-pink-50 dark:bg-gray-800 px-4 pb-4">
          <Link
            to="/"
            className="block py-2 text-primary dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block py-2 text-primary dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="block py-2 text-primary dark:text-white relative"
            onClick={() => setIsOpen(false)}
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute left-16 top-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
