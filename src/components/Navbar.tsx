'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { ShoppingCart, Search, MapPin, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
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

  const { t, i18n } = useTranslation();

  const categories = [
    { name: t('categories.pizza'), key: 'Pizza', icon: '🍕' },
    { name: t('categories.biryani'), key: 'Biryani', icon: '🍛' },
    { name: t('categories.indian'), key: 'Indian', icon: '🍛' },
    { name: t('categories.chinese'), key: 'Chinese', icon: '🥡' },
    { name: t('categories.burger'), key: 'Burger', icon: '🍔' },
    { name: t('categories.southIndian'), key: 'South Indian', icon: '🥞' },
    { name: t('categories.dessert'), key: 'Dessert', icon: '🍰' },
    { name: t('categories.fastFood'), key: 'Fast Food', icon: '🍟' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
    setCategoriesOpen(false);
  };

  return (
    <nav className="bg-background shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary px-4">
              🍕 FoodDelivery
            </div>
          </Link>

          {/* Location */}
          <div className="hidden lg:flex items-center space-x-2 text-foreground">
            <MapPin className="h-5 w-5" />
            <span className="text-sm">{t('deliverTo')} Current Location</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full text-foreground pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {/* Categories Dropdown */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <span>{t('category')}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <button
                        key={category.key}
                        onClick={() => handleCategoryClick(category.key)}
                        className="flex items-center space-x-2 px-4 py-2 text-left hover:bg-accent transition-colors"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm text-card-foreground">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            {isSignedIn && (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/orders" className="text-foreground hover:text-primary transition-colors">
                  {t('orders')}
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.totalItems}
                </span>
              )}
            </Link>

            {/* User Authentication */}
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="hidden md:block text-sm text-foreground">
                  {t('hello')}, {user?.firstName}!
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                  {t('signIn')}
                </button>
              </SignInButton>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants, food..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card placeholder:text-muted-foreground"
            />
          </div>
        </form>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-2">
              {/* Mobile Categories */}
              <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t('category')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => {
                          handleCategoryClick(category.name);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-left hover:bg-accent rounded-lg transition-colors"
                      >
                        <span className="text-sm">{category.icon}</span>
                        <span className="text-sm text-card-foreground">{category.name}</span>
                      </button>
                  ))}
                </div>
              </div>

              {isSignedIn && (
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              )}
              <div className="px-4 py-2 flex items-center space-x-2 text-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Deliver to: Current Location</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for categories dropdown */}
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