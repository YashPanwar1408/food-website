import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-500">🍕 FoodDelivery</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your favorite food delivery service. Fast, reliable, and delicious meals delivered right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Browse Food
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search?category=Pizza" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Pizza
                </Link>
              </li>
              <li>
                <Link href="/search?category=Biryani" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Biryani
                </Link>
              </li>
              <li>
                <Link href="/search?category=Indian" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Indian
                </Link>
              </li>
              <li>
                <Link href="/search?category=Chinese" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Chinese
                </Link>
              </li>
              <li>
                <Link href="/search?category=Burger" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Burgers
                </Link>
              </li>
              <li>
                <Link href="/search?category=Dessert" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300 text-sm">+91 90000 00000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300 text-sm">support@fooddelivery.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Food Street,<br />
                  Delhi, India 110000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 FoodDelivery. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;