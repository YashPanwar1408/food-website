/* yashpanwar1408/food-website/food-website-dfe3d219bbbd4abfce9f29fc60afeda7ab3ecb14/src/components/Footer.tsx */
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">🍕 FoodDelivery</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your favorite food delivery service. Fast, reliable, and delicious meals delivered right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-primary transition-colors text-sm">Browse Food</Link></li>
              <li><Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors text-sm">My Orders</Link></li>
              <li><Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors text-sm">Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('categories')}</h3>
            <ul className="space-y-2">
              <li><Link href="/search?category=Pizza" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('categories.pizza')}</Link></li>
              <li><Link href="/search?category=Biryani" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('categories.biryani')}</Link></li>
              <li><Link href="/search?category=Indian" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('categories.indian')}</Link></li>
              <li><Link href="/search?category=Chinese" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('categories.chinese')}</Link></li>
              <li><Link href="/search?category=Burger" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('categories.burger')}</Link></li>
              <li><Link href="/search?category=Dessert" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('categories.dessert')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('contactUs')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                {/* FIX: Using theme-aware color */}
                <span className="text-muted-foreground text-sm">+91 90000 00000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">support@fooddelivery.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  {t('addressLine1')}<br />
                  {t('addressLine2')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              &copy; 2025 FoodDelivery. {t('allRightsReserved')}
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('privacyPolicy')}</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('termsOfService')}</Link>
              <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('support')}</Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;