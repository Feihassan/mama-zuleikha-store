import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function AdminProducts() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.success('Logged out');
  };
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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [navigate, fetchProducts]);

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: form.title,
      description: form.description,
      price: parseFloat(form.price),
      image_url: form.image,
      category: form.category,
      stock_quantity: form.inStock ? 50 : 0 // Default stock quantity
    };

    try {
      let response;

      const token = localStorage.getItem('token');

      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
        toast.success('Product updated!');
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
        toast.success('Product added!');
      }

      if (response.ok) {
        fetchProducts(); // Refresh products list
        setForm({ title: '', category: 'Skincare', price: '', originalPrice: '', description: '', image: '', inStock: true });
        setShowForm(false);
        setEditingProduct(null);
      } else {
        toast.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProducts(); // Refresh products list
        toast.success('Product deleted!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const editProduct = (product) => {
    setForm({
      title: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.price.toString(), // Use same price for now
      description: product.description,
      image: product.image_url,
      inStock: product.stock_quantity > 0
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
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Orders
          </button>
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
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setForm({...form, image: event.target.result});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="border rounded px-3 py-2"
              />
              <input
                type="url"
                placeholder="Or paste image URL"
                value={form.image}
                onChange={(e) => setForm({...form, image: e.target.value})}
                className="border rounded px-3 py-2"
              />
              {form.image && (
                <img src={form.image} alt="Preview" className="w-20 h-20 rounded object-cover" />
              )}
            </div>
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
            <img src={product.image_url} alt={product.name} className="w-20 h-20 rounded object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-sm">Ksh {product.price} (Stock: {product.stock_quantity})</p>
              <p className="text-xs text-gray-500">{product.description?.substring(0, 100)}...</p>
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
                className={`px-3 py-1 rounded text-sm ${
                  product.stock_quantity === 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                disabled={product.stock_quantity === 0}
                title={product.stock_quantity === 0 ? 'Cannot delete products that have been ordered' : 'Delete product'}
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