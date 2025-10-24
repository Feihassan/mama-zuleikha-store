import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match frontend structure
          const transformedProducts = data.map(product => ({
            id: product.id,
            title: product.name,
            category: product.category,
            price: parseFloat(product.price),
            description: product.description,
            image: product.image_url,
            inStock: product.stock_quantity > 0
          }));
          setProducts(transformedProducts);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const allCategories = ["All", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Filter by category
  const categoryFiltered =
    selected === "All"
      ? products
      : products.filter((p) => p.category === selected);

  // Filter by search term (on the 'title' field)
  const filtered = categoryFiltered.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto text-center">
        <div className="text-primary">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-primary">
        Our Products
      </h1>

      {/* 🔍 Search Input */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-full border w-full sm:w-96 dark:text-black"
        />
      </div>

      {/* 🔘 Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 text-sm sm:text-base rounded-full border transition ${
              selected === cat
                ? "bg-primary text-white"
                : "text-primary border-pink-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🛍 Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No products found.</p>
      )}
    </div>
  );
}

export default Products;
