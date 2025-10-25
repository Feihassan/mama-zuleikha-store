import { useState } from 'react';

function FilterSidebar({ onFilterChange }) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStock, setInStock] = useState(false);
  const [rating, setRating] = useState(0);

  const categories = [
    'Skincare',
    'Makeup', 
    'Body Care',
    'Natural',
    'Wellness'
  ];

  // Removed unused brands list to avoid lint warnings

  const handleCategoryChange = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updated);
    updateFilters({ categories: updated });
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    updateFilters({ priceRange: newRange });
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    updateFilters({ rating: newRating });
  };

  const handleInStockChange = (checked) => {
    setInStock(checked);
    updateFilters({ inStock: checked });
  };

  const updateFilters = (newFilter) => {
    const updatedFilters = {
      categories: selectedCategories,
      priceRange,
      rating,
      inStock,
      ...newFilter
    };
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setRating(0);
    setInStock(false);
    onFilterChange({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-pink-600 hover:text-pink-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="5000"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Ksh 0</span>
            <span>Ksh {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={stars}
                checked={rating === stars}
                onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                className="text-pink-600 focus:ring-pink-500"
              />
              <div className="ml-2 flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < stars ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Availability</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;