import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    setReviews(allReviews[productId] || []);
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newReview = {
      ...form,
      id: Date.now(),
      date: new Date().toISOString(),
      productId
    };

    const allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    const productReviews = allReviews[productId] || [];
    productReviews.unshift(newReview);
    allReviews[productId] = productReviews;
    
    localStorage.setItem('productReviews', JSON.stringify(allReviews));
    setReviews(productReviews);
    setForm({ name: '', rating: 5, comment: '' });
    setShowForm(false);
    toast.success('Review added successfully!');
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-gray-600">
                {averageRating} out of 5 ({reviews.length} reviews)
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-700 transition"
        >
          Write Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid gap-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Rating</label>
              {renderStars(form.rating, true, (rating) => setForm({...form, rating}))}
            </div>
            <div>
              <label className="block mb-1 font-medium">Review</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({...form, comment: e.target.value})}
                className="w-full border rounded px-3 py-2"
                rows="3"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-700"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.name}</p>
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;