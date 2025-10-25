import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h2 className="text-2xl font-semibold mb-4 text-primary">📦 Product Management</h2>
          <p className="text-gray-600 mb-6">
            Add, edit, and manage your product inventory. Update prices, descriptions, and stock levels.
          </p>
          <Link
            to="/admin/products"
            className="bg-primary text-white px-6 py-3 rounded hover:bg-pink-700 inline-block"
          >
            Manage Products
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h2 className="text-2xl font-semibold mb-4 text-primary">📋 Order Management</h2>
          <p className="text-gray-600 mb-6">
            View and track customer orders. Monitor order status and manage fulfillment.
          </p>
          <Link
            to="/admin/orders"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 inline-block"
          >
            View Orders
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">--</div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">--</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">--</div>
            <div className="text-gray-600">Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;