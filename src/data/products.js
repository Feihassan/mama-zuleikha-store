const products = [
  {
    id: 1,
    title: "Hydrating Face Serum",
    category: "Skincare",
    price: 1200,
    originalPrice: 1500,
    description: "Deep hydrating serum with hyaluronic acid for all skin types. Reduces fine lines and restores moisture balance.",
    ingredients: ["Hyaluronic Acid", "Vitamin E", "Aloe Vera", "Rose Water"],
    inStock: true,
    rating: 4.8,
    reviews: 124,
    image: "https://plus.unsplash.com/premium_photo-1664304033707-ae06b846b2de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SHlkcmF0aW5nJTIwRmFjZSUyMFNlcnVtfGVufDB8fDB8fHww"
  },
  {
    id: 2,
    title: "Matte Liquid Lipstick",
    category: "Makeup",
    price: 1,
    originalPrice: 20,
    description: "Long-lasting matte liquid lipstick with rich pigmentation. Comfortable wear for up to 8 hours.",
    ingredients: ["Natural Wax", "Vitamin E", "Jojoba Oil"],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1714420076326-476283c9fcfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TWF0dGUlMjBMaXF1aWQlMjBMaXBzdGlja3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    title: "Nourishing Body Lotion",
    category: "Body Care",
    price: 950,
    originalPrice: 1200,
    description: "Rich, nourishing body lotion with shea butter and coconut oil. Perfect for dry and sensitive skin.",
    ingredients: ["Shea Butter", "Coconut Oil", "Vitamin E", "Lavender Extract"],
    inStock: true,
    rating: 4.7,
    reviews: 156,
    image: "https://media.istockphoto.com/id/2184245606/photo/hands-hold-white-bottle-with-nourishing-mask-for-applying-to-hair-or-skin-beauty-and-spa.jpg?s=612x612&w=0&k=20&c=6h9sZkfBVcQMwHOQwE5D_7qIuLeMEkSDVN_Z7gHp6JI="
  },
  {
    id: 4,
    title: "Pure Aloe Vera Gel",
    category: "Natural",
    price: 700,
    originalPrice: 900,
    description: "100% pure aloe vera gel for soothing and healing. Great for sunburn, acne, and daily moisturizing.",
    ingredients: ["Pure Aloe Vera", "Vitamin E"],
    inStock: true,
    rating: 4.9,
    reviews: 203,
    image: "https://media.istockphoto.com/id/1348426594/photo/aloe-vera-plant-and-aloe-vera-gel.jpg?s=612x612&w=0&k=20&c=TyhgHPatt8m7MEDeyvQgTULdeOH0KJleDh_UGd2gAYY="
  },
  {
    id: 5,
    title: "Essential Oils Collection",
    category: "Wellness",
    price: 1450,
    originalPrice: 1800,
    description: "Premium collection of 5 essential oils: Lavender, Tea Tree, Eucalyptus, Peppermint, and Lemon.",
    ingredients: ["Pure Essential Oils", "No Additives"],
    inStock: true,
    rating: 4.5,
    reviews: 67,
    image: "https://media.istockphoto.com/id/2197925713/photo/woman-holding-a-cosmetic-bottle-with-pump-dispenser-on-neutral-background.jpg?s=612x612&w=0&k=20&c=9W1yvNMPDwbUVyBcsMoGUwb-CrBJpe2U5V2OgHbf9qY="
  },
  {
    id: 6,
    title: "Vitamin C Brightening Cream",
    category: "Skincare",
    price: 1750,
    originalPrice: 2100,
    description: "Powerful vitamin C cream that brightens skin tone and reduces dark spots. Anti-aging formula.",
    ingredients: ["Vitamin C", "Niacinamide", "Hyaluronic Acid", "Peptides"],
    inStock: true,
    rating: 4.8,
    reviews: 178,
    image: "https://images.pexels.com/photos/31015384/pexels-photo-31015384.jpeg"
  },
  {
    id: 7,
    title: "Anti-Aging Night Serum",
    category: "Skincare",
    price: 1950,
    originalPrice: 2300,
    description: "Intensive night serum with retinol and peptides. Reduces wrinkles and improves skin texture.",
    ingredients: ["Retinol", "Peptides", "Vitamin E", "Squalane"],
    inStock: true,
    rating: 4.7,
    reviews: 92,
    image: "https://images.pexels.com/photos/15510370/pexels-photo-15510370.jpeg"
  },
  {
    id: 8,
    title: "Gentle Cleansing Oil",
    category: "Skincare",
    price: 1350,
    originalPrice: 1600,
    description: "Gentle cleansing oil that removes makeup and impurities without stripping natural oils.",
    ingredients: ["Jojoba Oil", "Sweet Almond Oil", "Vitamin E"],
    inStock: true,
    rating: 4.6,
    reviews: 134,
    image: "https://images.pexels.com/photos/28255122/pexels-photo-28255122.jpeg"
  },
  {
    id: 9,
    title: "K-Beauty Skincare Set",
    category: "Skincare",
    price: 3750,
    originalPrice: 4500,
    description: "Complete Korean skincare routine set with cleanser, toner, essence, serum, and moisturizer.",
    ingredients: ["Snail Mucin", "Hyaluronic Acid", "Niacinamide", "Ceramides"],
    inStock: false,
    rating: 4.9,
    reviews: 45,
    image: "https://cdn.thewirecutter.com/wp-content/media/2024/12/ROUNDUP-KOREAN-SKINCARE-2048px-9736-2x1-1.jpg?width=1024&quality=75&crop=2:1&auto=webp"
  }
];

// Get admin products from localStorage and merge with default products
const getProducts = () => {
  const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
  return [...products, ...adminProducts];
};

export default getProducts();
export { getProducts };
