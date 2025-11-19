import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('30ml');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const product = await response.json();
          setProduct(product);
          
          // Fetch related products
          const relatedResponse = await fetch(`/api/products?category=${product.category}&limit=4&exclude=${id}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.products || []);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock_quantity <= 0) {
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
    <main className="flex-1 px-4 sm:px-8 lg:px-16 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 pb-8">
          <Link to="/" className="text-gray-500 text-sm font-medium leading-normal hover:text-primary">Home</Link>
          <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
          <Link to="/products" className="text-gray-500 text-sm font-medium leading-normal hover:text-primary">Skincare</Link>
          <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
          <span className="text-gray-900 text-sm font-medium leading-normal">Serums</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div 
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl shadow-sm"
              style={{ backgroundImage: `url(${product.images ? product.images[selectedImage] : product.image_url})` }}
            ></div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg cursor-pointer transition-opacity ${
                      selectedImage === index ? 'border-2 border-primary shadow-sm' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundImage: `url(${image})` }}
                    onClick={() => setSelectedImage(index)}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-primary tracking-wide">{product.category}</p>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-2xl text-gray-900 mt-4">${parseFloat(product.price).toFixed(2)}</p>
            <p className="text-base text-gray-600 mt-4 leading-relaxed">{product.description}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </span>
            </div>
            
            {/* Size Selection - Only show if product has size variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Size</h3>
                <div className="flex gap-3 mt-3">
                  {product.sizes.map((size) => (
                    <button 
                      key={size}
                      className={`px-5 py-2 rounded-full border text-sm font-semibold ${
                        selectedSize === size 
                          ? 'border-primary bg-primary/20 text-gray-900' 
                          : 'border-gray-300 text-gray-600 hover:border-primary'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button 
                  className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-2 text-gray-900 font-semibold">{quantity}</span>
                <button 
                  className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 text-white bg-primary hover:opacity-90 transition-opacity font-bold py-3.5 px-6 rounded-lg shadow-sm"
              >
                <span>Add to Cart</span>
              </button>
              <button className="p-3 rounded-lg border border-gray-300 text-gray-900 hover:border-primary hover:bg-primary/10 transition-colors">
                <span className="text-xl">♡</span>
              </button>
            </div>

            {/* Product Features */}
            <div className="flex flex-col gap-3 text-sm text-gray-600 mt-8">
              <div className="flex items-center gap-3">
                <span className="text-base">🚚</span>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base">✓</span>
                <span>Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex border-b border-gray-200 mb-8">
            <button 
              className={`px-1 pb-3 text-base font-semibold border-b-2 ${
                activeTab === 'description' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Full Description
            </button>
            <button 
              className={`px-4 pb-3 text-base font-medium ${
                activeTab === 'ingredients' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button 
              className={`px-4 pb-3 text-base font-medium ${
                activeTab === 'reviews' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Customer Reviews (12)
            </button>
          </div>
          
          {activeTab === 'description' && (
            <div className="prose prose-neutral max-w-none text-gray-600 leading-relaxed">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Unlock Your Inner Glow</h4>
              <p>Our Hydrating Glow Serum is a daily ritual for radiant skin. This potent yet gentle formula is designed to deeply moisturize, brighten, and improve skin texture. With a blend of nature's finest ingredients, it works to reduce the appearance of fine lines and give you a healthy, dewy complexion that shines from within.</p>
              <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-2">How to Use</h4>
              <p>Apply 2-3 drops to clean, damp skin morning and night. Gently pat into face and neck until fully absorbed. Follow with your favorite moisturizer. For best results, use daily.</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                <span className="text-xl">←</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} to={`/products/${relatedProduct.id}`} className="flex flex-col gap-3 group">
                <div className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl overflow-hidden">
                  <div 
                    className="w-full h-full bg-center bg-no-repeat bg-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${relatedProduct.image_url})` }}
                  ></div>
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="font-semibold text-gray-900">{relatedProduct.name}</h3>
                  <p className="text-sm text-gray-600">${parseFloat(relatedProduct.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
