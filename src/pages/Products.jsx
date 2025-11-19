import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [10, 200],
    rating: 0
  });
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);



  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryParam = searchParams.get('category');
        const url = categoryParam ? `/api/products?category=${categoryParam}` : '/api/products';
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
          setFilteredProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    if (filters.priceRange) {
      filtered = filtered.filter(p =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [10, 200],
      rating: 0
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto flex flex-1 flex-col px-4 py-8 lg:flex-row lg:gap-8">
      {/* Filter Sidebar */}
      <aside className="w-full lg:w-64 xl:w-72 shrink-0 mb-8 lg:mb-0">
        <div className="sticky top-24 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Filters</h3>
            
            {/* Category Filter */}
            <div>
              <h4 className="font-semibold mb-2">Category</h4>
              <div className="space-y-1.5">
                {products.reduce((categories, product) => {
                  if (!categories.includes(product.category)) {
                    categories.push(product.category);
                  }
                  return categories;
                }, []).map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary focus:ring-primary/50"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        const newCategories = e.target.checked 
                          ? [...filters.categories, category]
                          : filters.categories.filter(c => c !== category);
                        handleFilterChange({ ...filters, categories: newCategories });
                      }}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-semibold mb-2">Price Range</h4>
              <div className="relative h-1 w-full rounded-full bg-gray-200">
                <div className="absolute h-1 rounded-full bg-primary" style={{ left: '10%', width: '60%' }}></div>
                <div className="absolute -top-1.5 h-4 w-4 rounded-full bg-white border-2 border-primary cursor-pointer" style={{ left: '10%' }}></div>
                <div className="absolute -top-1.5 h-4 w-4 rounded-full bg-white border-2 border-primary cursor-pointer" style={{ left: '70%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>$10</span>
                <span>$200</span>
              </div>
            </div>

            {/* Customer Rating */}
            <div>
              <h4 className="font-semibold mb-2">Customer Rating</h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-primary text-lg">★★★★</span><span className="text-gray-300 text-lg">☆</span>
                  <span className="text-sm ml-1">& Up</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer opacity-60">
                  <span className="text-primary text-lg">★★★</span><span className="text-gray-300 text-lg">☆☆</span>
                  <span className="text-sm ml-1">& Up</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-col gap-2">
            <button className="w-full flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
              Apply Filters
            </button>
            <button 
              onClick={clearFilters}
              className="w-full flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-gray-600 hover:bg-primary/10 text-sm font-bold leading-normal tracking-[0.015em]"
            >
              Clear All
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="w-full">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-primary">Home</Link>
          <span className="text-gray-500 text-sm">/</span>
          <Link to="/products" className="text-sm font-medium text-gray-500 hover:text-primary">Skincare</Link>
          <span className="text-gray-500 text-sm">/</span>
          <span className="text-sm font-medium">Moisturizers</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">All Skincare Products</h1>
        </div>

        {/* Sorting Chips */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 px-4">
            <p className="text-primary text-sm font-medium">Sort by: Popularity</p>
            <span className="text-lg text-primary">▼</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 px-4 hover:bg-primary/20">
            <p className="text-sm font-medium">Price</p>
            <span className="text-lg">▼</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 px-4 hover:bg-primary/20">
            <p className="text-sm font-medium">Rating</p>
            <span className="text-lg">▼</span>
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="flex flex-col group">
                <div className="relative overflow-hidden rounded-xl mb-3">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${product.image_url})` }}
                  ></div>
                  <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xl">🛒</span>
                  </button>
                </div>
                <div>
                  <p className="font-medium leading-normal">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="font-semibold mt-1">${parseFloat(product.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;