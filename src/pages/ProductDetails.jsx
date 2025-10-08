import { useParams } from "react-router-dom";
import products from "../data/products";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ProductReviews from "../components/ProductReviews";

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id.toString() === id);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart!"); // ✅ Replaced alert with toast
  };

  if (!product) return <p className="p-8">Product not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-cover rounded-xl shadow-md"
        />

        {/* Product Info */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            {product.title}
          </h1>
          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
          <p className="text-xl font-semibold text-primary mb-4">
            Ksh {product.price}
          </p>

          <p className="text-gray-700 mb-6">
            {product.description || "This luxurious product is designed to enhance your natural beauty with nourishing ingredients and stunning results."}
          </p>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Key Ingredients:</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-sm">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="bg-pink-200 text-pink-700 px-3 py-1 rounded hover:bg-pink-300"
            >
              –
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="bg-pink-200 text-pink-700 px-3 py-1 rounded hover:bg-pink-300"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
      
      {/* Product Reviews */}
      <ProductReviews productId={product.id} />
    </div>
  );
}

export default ProductDetails;
