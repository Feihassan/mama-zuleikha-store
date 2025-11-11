function About() {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">About GlowHub</h1>
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <img 
          src="https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg" 
          alt="GlowHub founder"
          className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
        />
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Founded with love and passion for natural beauty, GlowHub brings you
          handcrafted skincare and cosmetics that celebrate your natural glow.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-light p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-primary mb-3">Our Mission</h3>
          <p className="text-gray-700">
            To provide high-quality, natural beauty products that enhance your confidence 
            and celebrate your unique beauty. We believe every woman deserves to feel 
            radiant and empowered.
          </p>
        </div>
        <div className="bg-light p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-primary mb-3">Our Values</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✨ Natural & Safe Ingredients</li>
            <li>💝 Quality & Excellence</li>
            <li>🌱 Sustainable Practices</li>
            <li>❤️ Customer Satisfaction</li>
          </ul>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-center mb-6">Why Choose GlowHub?</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🌿</div>
            <h4 className="font-semibold mb-2">Natural Ingredients</h4>
            <p className="text-sm text-gray-600">
              We use only the finest natural ingredients sourced responsibly.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🧪</div>
            <h4 className="font-semibold mb-2">Quality Tested</h4>
            <p className="text-sm text-gray-600">
              Every product is carefully tested for safety and effectiveness.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💖</div>
            <h4 className="font-semibold mb-2">Made with Love</h4>
            <p className="text-sm text-gray-600">
              Handcrafted with care and attention to detail in every batch.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-primary text-white p-8 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Ready to Glow?</h3>
        <p className="mb-6">
          Join thousands of satisfied customers who trust GlowHub for their beauty needs.
        </p>
        <a 
          href="/products" 
          className="inline-block bg-white text-primary px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}

export default About;