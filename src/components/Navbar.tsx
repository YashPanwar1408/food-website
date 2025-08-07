'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { ShoppingCart, Search, MapPin, Menu, X, ChevronDown } from 'lucide-react';
import { ModeToggle } from './ui/ModeToggle';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const { state } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const { t } = useTranslation();

  const categories = [
    { key: 'pizza', icon: '🍕' },
    { key: 'biryani', icon: '🍛' },
    { key: 'indian', icon: '🇮🇳' },
    { key: 'chinese', icon: '🥡' },
    { key: 'burger', icon: '🍔' },
    { key: 'southindian', icon: '🥞' },
    { key: 'dessert', icon: '🍰' },
    { key: 'fastfood', icon: '🍟' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    // FIX: `bg-background` makes the navbar solid and not transparent on scroll.
    <nav className="bg-background shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl sm:block hidden">🍕</span>
            <span className="text-xl sm:text-2xl font-bold text-primary">FoodDelivery</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-2 text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm">{t('deliverTo')} Current Location</span>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full text-foreground pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card placeholder:text-muted-foreground"
              />
            </div>
          </form>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ModeToggle />
            <div className="hidden lg:block relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <span>{t('category')}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {categoriesOpen && (
                // FIX: `bg-card` and `border` make the dropdown visible in both themes.
                <div className="absolute top-full right-0 mt-2 w-64 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <button
                        key={category.key}
                        onClick={() => handleCategoryClick(t(`categories.${category.key}`))}
                        className="flex items-center space-x-2 px-4 py-2 text-left hover:bg-accent transition-colors w-full"
                      >
                        <span className="text-lg">{category.icon}</span>
                        {/* FIX: Correctly translates the category name in the dropdown. */}
                        <span className="text-sm text-card-foreground">{t(`categories.${category.key}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isSignedIn && (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/orders" className="text-foreground hover:text-primary transition-colors">{t('orders')}</Link>
              </div>
            )}

            <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.totalItems}
                </span>
              )}
            </Link>

            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="hidden md:block text-sm text-foreground">
                  {t('hello')}, {user?.firstName}!
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">{t('signIn')}</button>
              </SignInButton>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            {/* Mobile menu content can be expanded here */}
          </div>
        )}
      </div>

      {categoriesOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCategoriesOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;