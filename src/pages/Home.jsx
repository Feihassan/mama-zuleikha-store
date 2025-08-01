import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

function Home() {
  const newArrivals = products.slice(0, 3); // Preview first 3 products

  const testimonials = [
    {
      name: "Aisha M.",
      message: "I love how soft my skin feels now! Mama Zulekha is a must-have.",
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
    <div className="text-primary dark:text-white">
      {/* ✅ Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-cover bg-center bg-no-repeat text-white px-6 py-32 sm:py-48 text-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/9149045/pexels-photo-9149045.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative max-w-2xl mx-auto z-10">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Glow Naturally <br /> with Mama Zulekha
          </h1>
          <p className="text-lg sm:text-xl mb-6 text-gray-100">
            Discover handcrafted skincare, makeup, and wellness products made for you.
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium transition"
          >
            Shop Now
          </Link>
        </div>
      </motion.section>

      {/* ✅ New Arrivals */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          New Arrivals
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="text-primary underline hover:text-pink-700"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* ✅ Brand Story */}
      <section className="bg-pink-50 dark:bg-gray-800 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Why Mama Zulekha?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            At Mama Zulekha, we believe every woman deserves to feel confident,
            radiant, and real. We bring you clean, quality-tested skincare and
            cosmetics with love, care, and a touch of beauty magic. Your glow is
            our mission.
          </p>
        </div>
      </section>

      {/* ✅ Testimonials Section */}
      <section className="bg-white dark:bg-gray-900 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">
            What Our Customers Say
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-pink-100 dark:bg-gray-800 p-6 rounded-lg shadow text-left"
              >
                <p className="text-gray-800 dark:text-gray-200 mb-4 italic">"{t.message}"</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ✅ Newsletter Signup */}
<section className="bg-pink-50 dark:bg-gray-800 py-16 px-6">
  <div className="max-w-xl mx-auto text-center">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
      Join Our Glow-Up Newsletter
    </h2>
    <p className="text-gray-700 dark:text-gray-300 mb-6">
      Be the first to know about new arrivals, beauty tips, and exclusive offers.
    </p>
    <form
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

        alert("Thank you for subscribing!");
        e.target.reset();
      }}
      className="flex flex-col sm:flex-row gap-4 justify-center"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="px-4 py-2 rounded-full border w-full sm:w-auto flex-1 dark:text-black"
      />
      <button
        type="submit"
        className="bg-primary hover:bg-pink-700 text-white px-6 py-2 rounded-full transition"
      >
        Subscribe
      </button>
    </form>
  </div>
</section>

    </div>
  );
}

export default Home;
