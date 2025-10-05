import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function AdminProducts() {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
    toast.success('Logged out');
  };

  if (!localStorage.getItem('adminAuth')) {
    return null;
  }
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Skincare',
    price: '',
    originalPrice: '',
    description: '',
    image: '',
    inStock: true
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('adminProducts')) || [];
    setProducts(stored);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      ...form,
      price: parseInt(form.price),
      originalPrice: parseInt(form.originalPrice),
      rating: 4.5,
      reviews: 0,
      ingredients: []
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
      toast.success('Product updated!');
    } else {
      updatedProducts = [...products, newProduct];
      toast.success('Product added!');
    }

    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    
    setForm({ title: '', category: 'Skincare', price: '', originalPrice: '', description: '', image: '', inStock: true });
    setShowForm(false);
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('adminProducts', JSON.stringify(updated));
    toast.success('Product deleted!');
  };

  const editProduct = (product) => {
    setForm({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      description: product.description,
      image: product.image,
      inStock: product.inStock
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Products</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Add Product
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Title"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
              className="border rounded px-3 py-2"
            >
              <option value="Skincare">Skincare</option>
              <option value="Makeup">Makeup</option>
              <option value="Body Care">Body Care</option>
              <option value="Natural">Natural</option>
              <option value="Wellness">Wellness</option>
            </select>
            <input
              type="number"
              placeholder="Price (Ksh)"
              value={form.price}
              onChange={(e) => setForm({...form, price: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Original Price (Ksh)"
              value={form.originalPrice}
              onChange={(e) => setForm({...form, originalPrice: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="url"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({...form, image: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({...form, inStock: e.target.checked})}
              />
              <label>In Stock</label>
            </div>
            <textarea
              placeholder="Product Description"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="border rounded px-3 py-2 md:col-span-2"
              rows="3"
              required
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-700">
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setForm({ title: '', category: 'Skincare', price: '', originalPrice: '', description: '', image: '', inStock: true });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 flex gap-4">
            <img src={product.image} alt={product.title} className="w-20 h-20 rounded object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-sm">Ksh {product.price} <span className="line-through text-gray-400">Ksh {product.originalPrice}</span></p>
              <p className="text-xs text-gray-500">{product.description.substring(0, 100)}...</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => editProduct(product)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;