import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [dealOfTheDay, setDealOfTheDay] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=10');
        if (response.ok) {
          const data = await response.json();
          const products = data.products || [];
          const transformedProducts = products.slice(0, 3).map(product => ({
            id: product.id,
            title: product.name,
            category: product.category,
            price: parseFloat(product.price),
            description: product.description,
            image: product.image_url,
            inStock: product.stock_quantity > 0
          }));
          setNewArrivals(transformedProducts);

          // Set Deal of the Day - first product with 20% discount
          if (products.length > 0) {
            const dealProduct = products[0];
            setDealOfTheDay({
              id: dealProduct.id,
              title: dealProduct.name,
              category: dealProduct.category,
              originalPrice: parseFloat(dealProduct.price),
              price: Math.round(parseFloat(dealProduct.price) * 0.8), // 20% off
              description: dealProduct.description,
              image: dealProduct.image_url,
              inStock: dealProduct.stock_quantity > 0,
              discount: 20
            });
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const testimonials = [
    {
      name: "Aisha M.",
      message: "I love how soft my skin feels now! GlowHub is a must-have.",
    },
    {
      name: "Fatma K.",
      message: "The lip balm is magic. I’m never using store brands again!",
    },
    {
      name: "Joy W.",
      message: "Smooth, natural, glowing — I’m obsessed with these products.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* ✅ Modern Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6 py-20 sm:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">New Collection Available</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Glow
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                    Naturally
                  </span>
                  with GlowHub
                </h1>

                <p className="text-lg sm:text-xl mb-8 text-pink-100 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Discover handcrafted skincare, makeup, and wellness products made with love, care, and a touch of beauty magic.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/products"
                    className="group relative bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-light hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="relative z-10">Shop Collection</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>

                  <Link
                    to="/about"
                    className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    Learn More
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">500+</div>
                    <div className="text-sm text-pink-100">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">50+</div>
                    <div className="text-sm text-pink-100">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">4.9★</div>
                    <div className="text-sm text-pink-100">Rating</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Content - Product Showcase */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="relative">
                  {/* Floating Product Cards */}
                  <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-300">
                    <img
                      src="https://images.pexels.com/photos/7755515/pexels-photo-7755515.jpeg"
                      alt="Skincare"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="mt-2 text-xs font-semibold text-gray-800">Skincare</div>
                  </div>

                  <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-4 shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <img
                      src="https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg"
                      alt="Lip Care"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="mt-2 text-xs font-semibold text-gray-800">Lip Care</div>
                  </div>

                  {/* Main Product Image */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                    <img
                      src="https://images.pexels.com/photos/9149045/pexels-photo-9149045.jpeg"
                      alt="GlowHub Products"
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* ✅ Deal of the Day */}
      {dealOfTheDay && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 px-6 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-full font-semibold text-lg mb-4 shadow-lg"
              >
                <span className="animate-bounce">🔥</span>
                Deal of the Day
                <span className="animate-bounce">🔥</span>
              </motion.div>

              <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4">
                Limited Time Offer
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't miss out on our exclusive 20% discount! This offer ends soon.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={dealOfTheDay.image}
                    alt={dealOfTheDay.title}
                    className="w-full h-64 object-cover"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg animate-pulse">
                      -{dealOfTheDay.discount}%
                    </div>
                  </div>

                  {/* Time Left Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      ⏰ 24h left
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                      {dealOfTheDay.category}
                    </span>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      In Stock
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {dealOfTheDay.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {dealOfTheDay.description}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-primary">
                      Ksh {dealOfTheDay.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      Ksh {dealOfTheDay.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                      Save Ksh {(dealOfTheDay.originalPrice - dealOfTheDay.price).toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/products/${dealOfTheDay.id}`}
                    className="group w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl block text-center"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                      Shop Now - Limited Time!
                    </span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ✅ New Arrivals */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full font-medium mb-4"
          >
            ✨ New Collection
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            New Arrivals
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our latest handcrafted beauty products, made with love and the finest natural ingredients.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Explore All Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.section>

      {/* ✅ Brand Story */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-purple-700 px-4 py-2 rounded-full font-medium mb-6 shadow-lg">
                <span className="text-2xl">💖</span>
                Our Story
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
                Why Choose
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  GlowHub?
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                At GlowHub, we believe every woman deserves to feel confident,
                radiant, and real. We bring you clean, quality-tested skincare and
                cosmetics with love, care, and a touch of beauty magic.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500 mb-2">100%</div>
                  <div className="text-gray-600">Natural Ingredients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
                  <div className="text-gray-600">Customer Support</div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Learn More About Us</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>

            {/* Right Content - Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: "🌿", title: "Natural", desc: "100% natural ingredients" },
                { icon: "✨", title: "Effective", desc: "Proven results" },
                { icon: "💝", title: "Lovingly Made", desc: "Crafted with care" },
                { icon: "🔒", title: "Safe", desc: "Dermatologist tested" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ✅ Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 bg-gradient-to-r from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-lg mb-4 shadow-lg"
            >
              ⭐ Customer Reviews
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real customers who love our products
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                    </svg>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4 pt-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">"{t.message}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <svg className="w-16 h-16 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* ✅ Newsletter Signup */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold mb-6"
          >
            <span className="text-2xl">📧</span>
            Stay Updated
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Join Our Glow-Up Newsletter
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto"
          >
            Be the first to know about new arrivals, beauty tips, exclusive offers, and special promotions.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value.trim();
              if (!email || !email.includes("@")) {
                alert("Please enter a valid email address.");
                return;
              }

              // Save email to localStorage
              const list = JSON.parse(localStorage.getItem("subscribers")) || [];
              list.push({ email, date: new Date().toISOString() });
              localStorage.setItem("subscribers", JSON.stringify(list));

              alert("Thank you for subscribing! 🎉");
              e.target.reset();
            }}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center bg-white/10 backdrop-blur-lg p-2 rounded-2xl shadow-2xl">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border-0 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Subscribe Now ✨
              </button>
            </div>
          </motion.form>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto"
          >
            {[
              { icon: "🎁", text: "Exclusive Offers" },
              { icon: "🆕", text: "New Product Alerts" },
              { icon: "💡", text: "Beauty Tips & Tricks" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl py-3 px-4">
                <span className="text-2xl">{benefit.icon}</span>
                <span className="text-white font-medium">{benefit.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}

export default Home;
