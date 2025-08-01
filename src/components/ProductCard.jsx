import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-44 sm:h-52 object-cover mb-3 rounded-lg"
        />
        <h2 className="text-lg font-semibold text-primary">{product.title}</h2>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="text-base font-bold text-primary mt-1">
          Ksh {product.price}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
