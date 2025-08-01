function Footer() {
  return (
    <footer className="bg-gray-800 text-primary py-8 mt-12">
      
       {/* Running Social Links */}
<div className="overflow-hidden relative h-6 sm:h-auto">
  <div className="animate-marquee whitespace-nowrap flex gap-10 text-sm sm:text-base text-primary">
    <a href="#" className="hover:text-pink-700">Instagram</a>
    <a href="#" className="hover:text-pink-700">Facebook</a>
    <a href="#" className="hover:text-pink-700">TikTok</a>
    <a href="#" className="hover:text-pink-700">Pinterest</a>
    <a href="#" className="hover:text-pink-700">YouTube</a>
  </div>
</div>


      <div className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Mama Zulekha. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
