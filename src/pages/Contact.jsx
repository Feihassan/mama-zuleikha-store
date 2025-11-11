import { useState } from 'react';
import { toast } from 'react-hot-toast';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages.push({
      ...form,
      date: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-primary">📧</span>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">info@mamazulekha.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">📱</span>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">+254 700 000 000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">📍</span>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-600">Nairobi, Kenya</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">🕒</span>
              <div>
                <p className="font-medium">Business Hours</p>
                <p className="text-gray-600">Mon - Fri: 9AM - 6PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Subject *</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full hover:bg-secondary transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;