import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setStats(prev => ({ ...prev, totalProducts: productsData.products?.length || 0 }));
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
        const pendingOrders = ordersData.filter(order => order.status === 'pending').length;

        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.length,
          totalRevenue,
          pendingOrders
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const adminCards = [
    {
      title: "📦 Product Management",
      description: "Add, edit, and manage your product inventory. Update prices, descriptions, and stock levels.",
      link: "/admin/products",
      buttonText: "Manage Products",
      buttonClass: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
    },
    {
      title: "📋 Order Management",
      description: "View and track customer orders. Monitor order status and manage fulfillment.",
      link: "/admin/orders",
      buttonText: "View Orders",
      buttonClass: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              >
                <span className="text-2xl">👑</span>
                <span className="font-medium">Admin Dashboard</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Welcome Back,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Administrator
                </span>
              </h1>

              <p className="text-xl text-pink-100 max-w-2xl">
                Manage your GlowHub store efficiently. Monitor performance, handle orders, and grow your business.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: "Total Products", value: loading ? "..." : stats.totalProducts, icon: "📦", color: "from-pink-500 to-rose-500" },
            { label: "Total Orders", value: loading ? "..." : stats.totalOrders, icon: "📋", color: "from-blue-500 to-indigo-500" },
            { label: "Revenue", value: loading ? "..." : `Ksh ${stats.totalRevenue.toLocaleString()}`, icon: "💰", color: "from-green-500 to-emerald-500" },
            { label: "Pending Orders", value: loading ? "..." : stats.pendingOrders, icon: "⏳", color: "from-orange-500 to-red-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white text-xl`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Management Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {adminCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                  {card.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {card.description}
                </p>
                <Link
                  to={card.link}
                  className={`inline-flex items-center gap-2 ${card.buttonClass} text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  <span>{card.buttonText}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Decorative gradient bar */}
              <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 bg-white rounded-3xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { action: "Add New Product", link: "/admin/products", icon: "➕" },
              { action: "View All Orders", link: "/admin/orders", icon: "📋" },
              { action: "Back to Store", link: "/", icon: "🏠" }
            ].map((item) => (
              <Link
                key={item.action}
                to={item.link}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-pink-50 rounded-2xl transition-all duration-300 hover:scale-105 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <span className="font-medium text-gray-700 group-hover:text-pink-600">{item.action}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;