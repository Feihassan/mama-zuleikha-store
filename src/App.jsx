import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou"; 
import AdminOrders from "./pages/AdminOrders";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<AdminOrders />} />
      </Routes>

      <Footer />

      {/* ✅ Toast setup */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#f9f5f7",
            color: "#d63384",
            fontWeight: "bold",
          },
        }}
      />
    </Router>
  );
}

export default App;
