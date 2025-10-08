import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

const allCategories = ["All", ...new Set(products.map((p) => p.category))];

function Products() {
  const [selected, setSelected] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();

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
