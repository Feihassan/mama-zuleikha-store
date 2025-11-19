import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=8');
        if (response.ok) {
          const data = await response.json();
          const fetchedProducts = data.products || [];
          const transformedProducts = fetchedProducts.map(product => ({
            id: product.id,
            title: product.name,
            category: product.category,
            price: parseFloat(product.price),
            description: product.description,
            image: product.image_url,
            inStock: product.stock_quantity > 0
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        // Silently handle error - don't log to console
      }
    };

    fetchProducts();
  }, []);

  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bestsellers
        const bestsellersResponse = await fetch('/api/products?featured=true&limit=4');
        if (bestsellersResponse.ok) {
          const bestsellersData = await bestsellersResponse.json();
          setBestsellers(bestsellersData.products || []);
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div 
          className="flex min-h-[520px] flex-col gap-6 rounded-xl bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqM9IRrqkrlkaGRAUk2j3dPB5D_5uZXOtxEfOlGFDZB9S5gaAM3CHjEvESNqTm4xxmBbC6U4IlaSJYJyVFfYbScLE7UGO0agvVJ7AI7g9TNH1z7ceghHrssmSivfl-iSoWqa-01onH4kNlL5iqa1lh_H7Fui0svm3rOd4XjbwyVW040LDSxGfO69mCzp7VBfZuo76z9kt6bs2CpRWQp7hiZxA8INcxSia-hJtv_SEfpyhvk15BfIHmKG_PH_E9QsSevivMfFuW06wn")'
          }}
        >
          <div className="flex flex-col gap-4 max-w-2xl">
            <h1 className="font-serif text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              Embrace Your Natural Glow
            </h1>
            <p className="text-base font-normal leading-normal text-white/90 md:text-lg">
              Discover our new collection of clean, cruelty-free beauty essentials designed to enhance your radiance.
            </p>
          </div>
          <Link 
            to="/products"
            className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30"
          >
            <span className="truncate">Shop The Collection</span>
          </Link>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-gray-900 px-4 pb-6 text-center">Our Bestsellers</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group flex flex-col gap-3">
                <div 
                  className="relative w-full overflow-hidden bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl shadow-sm transition-shadow duration-300 group-hover:shadow-lg bg-gray-100"
                  style={{ backgroundImage: `url(${product.image_url})` }}
                >
                  <button className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center h-10 px-4 bg-white/80 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-lg">
                    Add to Cart
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-base font-medium leading-normal text-gray-900">{product.name}</p>
                  <p className="text-sm font-normal leading-normal text-gray-600">{product.category}</p>
                  <p className="text-sm font-normal leading-normal text-gray-900">${parseFloat(product.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Category Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-gray-900 px-4 pb-6 text-center">Shop by Category</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 h-72 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="group relative flex h-72 items-center justify-center overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image_url})` }}
                ></div>
                <div className="absolute inset-0 bg-black/30"></div>
                <h3 className="relative font-serif text-3xl font-bold text-white">{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center pb-8">What Our Community is Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="flex pb-2 text-primary">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <blockquote className="italic text-gray-600">"The Radiant Glow Serum has completely transformed my skin. I've never felt so confident!"</blockquote>
              <p className="mt-4 font-bold text-gray-900">- Jessica L.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="flex pb-2 text-primary">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <blockquote className="italic text-gray-600">"I'm obsessed with the Velvet Matte Lipstick. The color lasts all day without drying out my lips."</blockquote>
              <p className="mt-4 font-bold text-gray-900">- Megan P.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="flex pb-2 text-primary">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <blockquote className="italic text-gray-600">"Finally, a clean beauty brand that actually delivers. Mama Zuleikha's products are my new holy grail."</blockquote>
              <p className="mt-4 font-bold text-gray-900">- Chloe T.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Get 10% Off Your First Order</h2>
          <p className="mt-2 text-gray-600">Join our community and be the first to know about new arrivals, special offers, and beauty tips.</p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              className="flex-grow w-full rounded-lg h-12 px-4 bg-gray-50 border-none focus:ring-2 focus:ring-primary/50 text-gray-900 placeholder:text-gray-500" 
              placeholder="Enter your email address" 
              type="email"
            />
            <button 
              className="flex-shrink-0 flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white font-bold hover:bg-opacity-90 transition-colors" 
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Home;