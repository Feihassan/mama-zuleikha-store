import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ProductReviews from "../components/ProductReviews";
import LoadingSpinner from "../components/LoadingSpinner";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          const transformedProduct = {
            id: data.id,
            title: data.name,
            category: data.category,
            price: parseFloat(data.price),
            description: data.description,
            image: data.image_url || '/api/placeholder/400/400',
            inStock: data.stock_quantity > 0,
            stockQuantity: data.stock_quantity
          };
          setProduct(transformedProduct);
        } else {
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Added to cart!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

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
            Ksh {product.price.toLocaleString()}
          </p>
          
          {product.inStock ? (
            <p className="text-green-600 font-medium mb-4">✓ In Stock ({product.stockQuantity} available)</p>
          ) : (
            <p className="text-red-600 font-medium mb-4">✗ Out of Stock</p>
          )}

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
            disabled={!product.inStock}
            className="bg-primary text-white px-6 py-3 rounded-full hover:bg-secondary transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
      
      {/* Product Reviews */}
      <ProductReviews productId={product.id} />
    </div>
  );
}

export default ProductDetails;
