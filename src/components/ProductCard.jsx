import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200 group h-full flex flex-col">
          {/* Image Container */}
          <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-100">
            <motion.img
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: imageLoaded ? 1 : 1.2, opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Stock Status */}
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.inStock
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quick View Button */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Quick View
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Category Badge */}
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
              {product.title}
            </h3>

            {/* Price */}
            <div className="mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Ksh {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                </span>
              </div>

              {/* Rating Placeholder */}
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <span className="text-sm text-gray-500 ml-1">(4.5)</span>
              </div>
            </div>
          </div>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
