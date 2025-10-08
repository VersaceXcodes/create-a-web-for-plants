import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Facebook, Instagram } from 'lucide-react'; // Icons for social media links

const GV_Footer: React.FC = () => (
  <>
    <footer className="bg-white shadow-lg border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
        {/* Quick Links Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-base text-gray-600 hover:underline">About</Link></li>
            <li><Link to="/contact" className="text-base text-gray-600 hover:underline">Contact</Link></li>
            <li><Link to="/terms" className="text-base text-gray-600 hover:underline">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="text-base text-gray-600 hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Connect with Us</h2>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={24} className="text-gray-600 hover:text-blue-500" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={24} className="text-gray-600 hover:text-blue-500" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={24} className="text-gray-600 hover:text-blue-500" /></a>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Newsletter</h2>
          <p className="text-base text-gray-600">Subscribe to stay updated with our latest news and offerings.</p>
          <form action="#" method="POST" className="flex space-x-2">
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
            <button 
              type="submit" 
              className="px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              <Mail className="inline mr-2" size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  </>
);

export default GV_Footer;