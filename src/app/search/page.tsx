
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import { FoodItem, SearchFilters } from '@/types';
import FoodFilters from '@/components/FoodFilters';

// COPY THIS ENTIRE ARRAY

const mockFoodItems = [
  // Pizza
  { _id: '66a50275823161571b04b4d1', name: 'food.margheritaPizza.name', description: 'food.margheritaPizza.desc', price: 299, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400', category: 'Pizza', restaurant: 'Pizza Palace', rating: 4.5, preparationTime: 25, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4d2', name: 'food.pepperoniPizza.name', description: 'food.pepperoniPizza.desc', price: 349, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category: 'Pizza', restaurant: 'Pizza Palace', rating: 4.6, preparationTime: 25, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4d3', name: 'food.veggieSupremePizza.name', description: 'food.veggieSupremePizza.desc', price: 329, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', category: 'Pizza', restaurant: 'Pizza Palace', rating: 4.4, preparationTime: 30, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  // Biryani
  { _id: '66a50275823161571b04b4d4', name: 'food.chickenBiryani.name', description: 'food.chickenBiryani.desc', price: 349, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: 'Biryani', restaurant: 'Spice Garden', rating: 4.7, preparationTime: 35, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4d5', name: 'food.muttonBiryani.name', description: 'food.muttonBiryani.desc', price: 399, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400', category: 'Biryani', restaurant: 'Spice Garden', rating: 4.8, preparationTime: 45, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4d6', name: 'food.vegBiryani.name', description: 'food.vegBiryani.desc', price: 279, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', category: 'Biryani', restaurant: 'Spice Garden', rating: 4.3, preparationTime: 30, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  // Indian
  { _id: '66a50275823161571b04b4d7', name: 'food.paneerButterMasala.name', description: 'food.paneerButterMasala.desc', price: 249, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', category: 'Indian', restaurant: 'Curry House', rating: 4.3, preparationTime: 20, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4d8', name: 'food.butterChicken.name', description: 'food.butterChicken.desc', price: 299, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', category: 'Indian', restaurant: 'Curry House', rating: 4.6, preparationTime: 25, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4d9', name: 'food.dalMakhani.name', description: 'food.dalMakhani.desc', price: 199, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'Indian', restaurant: 'Curry House', rating: 4.4, preparationTime: 15, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  // Burger
  { _id: '66a50275823161571b04b4da', name: 'food.chickenBurger.name', description: 'food.chickenBurger.desc', price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'Burger', restaurant: 'Burger Junction', rating: 4.2, preparationTime: 15, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4db', name: 'food.vegBurger.name', description: 'food.vegBurger.desc', price: 149, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', category: 'Burger', restaurant: 'Burger Junction', rating: 4.0, preparationTime: 12, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4dc', name: 'food.cheeseBurger.name', description: 'food.cheeseBurger.desc', price: 229, image: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=400', category: 'Burger', restaurant: 'Burger Junction', rating: 4.3, preparationTime: 15, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  // Chinese
  { _id: '66a50275823161571b04b4dd', name: 'food.vegHakkaNoodles.name', description: 'food.vegHakkaNoodles.desc', price: 179, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', category: 'Chinese', restaurant: 'Dragon Wok', rating: 4.1, preparationTime: 18, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4de', name: 'food.chickenFriedRice.name', description: 'food.chickenFriedRice.desc', price: 219, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', category: 'Chinese', restaurant: 'Dragon Wok', rating: 4.4, preparationTime: 20, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4df', name: 'food.manchurian.name', description: 'food.manchurian.desc', price: 189, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', category: 'Chinese', restaurant: 'Dragon Wok', rating: 4.2, preparationTime: 22, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  // South Indian
  { _id: '66a50275823161571b04b4e0', name: 'food.masalaDosa.name', description: 'food.masalaDosa.desc', price: 129, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', category: 'South Indian', restaurant: 'South Spice', rating: 4.5, preparationTime: 15, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4e1', name: 'food.idliSambar.name', description: 'food.idliSambar.desc', price: 99, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', category: 'South Indian', restaurant: 'South Spice', rating: 4.3, preparationTime: 10, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4e2', name: 'food.uttapam.name', description: 'food.uttapam.desc', price: 149, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', category: 'South Indian', restaurant: 'South Spice', rating: 4.2, preparationTime: 18, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  // Dessert
  { _id: '66a50275823161571b04b4e3', name: 'food.chocolateBrownie.name', description: 'food.chocolateBrownie.desc', price: 129, image: 'https://res.cloudinary.com/dykqu1tie/image/upload/v1754395703/Brownie-Recipe-with-Cocoa-Powder_gq7ioe.jpg', category: 'Dessert', restaurant: 'Sweet Treats', rating: 4.6, preparationTime: 10, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4e4', name: 'food.gulabJamun.name', description: 'food.gulabJamun.desc', price: 89, image: 'https://res.cloudinary.com/dykqu1tie/image/upload/v1753794298/gulab_jamun_kmi4w2.jpg', category: 'Dessert', restaurant: 'Sweet Treats', rating: 4.7, preparationTime: 5, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4e5', name: 'food.iceCreamSundae.name', description: 'food.iceCreamSundae.desc', price: 149, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', category: 'Dessert', restaurant: 'Sweet Treats', rating: 4.4, preparationTime: 8, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  // Fast Food
  { _id: '66a50275823161571b04b4e6', name: 'food.frenchFries.name', description: 'food.frenchFries.desc', price: 99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', category: 'Fast Food', restaurant: 'Quick Bites', rating: 4.1, preparationTime: 8, isVegetarian: true, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4e7', name: 'food.chickenWings.name', description: 'food.chickenWings.desc', price: 249, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category: 'Fast Food', restaurant: 'Quick Bites', rating: 4.3, preparationTime: 20, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: '66a50275823161571b04b4e8', name: 'food.fishAndChips.name', description: 'food.fishAndChips.desc', price: 299, image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400', category: 'Fast Food', restaurant: 'Quick Bites', rating: 4.2, preparationTime: 25, isVegetarian: false, isAvailable: true, createdAt: new Date(), updatedAt: new Date() }
];


const SearchPage = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedItems, setDisplayedItems] = useState<FoodItem[]>([]);
    const [itemsToShow, setItemsToShow] = useState(12);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
      category: 'All',
      minPrice: undefined,
      maxPrice: undefined,
      isVegetarian: undefined,
      rating: 0,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  
    useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      setSearchQuery(searchParams.get('q') || '');
      setFilters(prevFilters => ({
        ...prevFilters,
        category: searchParams.get('category') || 'All',
      }));
    }, []);
  
    const categories = ['All', 'Pizza', 'Biryani', 'Indian', 'Chinese', 'Burger', 'South Indian', 'Dessert', 'Fast Food'];
  
    const filteredItems = useMemo(() => {
      let items = mockFoodItems.map(item => ({
        ...item,
        name: t(item.name),
        description: t(item.description),
      })) as FoodItem[];
  
      if (searchQuery.trim()) {
        const lowerCaseQuery = searchQuery.toLowerCase();
          items = items.filter(item => {
            const restaurantName = typeof item.restaurant === 'string' ? item.restaurant : (item.restaurant as { name: string }).name;
          return (
            item.name.toLowerCase().includes(lowerCaseQuery) ||
            item.description.toLowerCase().includes(lowerCaseQuery) ||
            item.category.toLowerCase().includes(lowerCaseQuery) ||
            restaurantName.toLowerCase().includes(lowerCaseQuery)
          );
        });
      }
  
      if (filters.category && filters.category !== 'All') {
        items = items.filter(item => item.category === filters.category);
      }
      if (filters.isVegetarian !== undefined) {
        items = items.filter(item => item.isVegetarian === filters.isVegetarian);
      }
      if (filters.rating && filters.rating > 0) {
        items = items.filter(item => item.rating >= filters.rating!);
      }
      if (filters.minPrice !== undefined) {
        items = items.filter(item => item.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        items = items.filter(item => item.price <= filters.maxPrice!);
      }
  
      if (filters.sortBy) {
        items.sort((a, b) => {
          let aValue: number, bValue: number;
          switch (filters.sortBy) {
            case 'price': aValue = a.price; bValue = b.price; break;
            case 'rating': aValue = a.rating; bValue = b.rating; break;
            case 'preparationTime': aValue = a.preparationTime; bValue = b.preparationTime; break;
            default: return 0;
          }
          return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });
      }
  
      return items;
    }, [searchQuery, filters, t]);
  
    useEffect(() => {
      setDisplayedItems(filteredItems.slice(0, itemsToShow));
    }, [filteredItems, itemsToShow]);
  
    const handleFilterChange = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    };
  
    const clearFilters = () => {
      setFilters({
        category: 'All',
        minPrice: undefined,
        maxPrice: undefined,
        isVegetarian: undefined,
        rating: 0,
        sortBy: 'rating',
        sortOrder: 'desc'
      });
    };
  
    const loadMore = () => {
      setItemsToShow(prev => prev + 12);
    };
  
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <h1 className="text-3xl font-bold text-foreground">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Search Food Items'}
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
  
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for food items, restaurants, cuisines..."
                className="w-full pl-10 pr-4 py-2 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
  
          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t('category')}</label>
                  <select
                    value={filters.category || 'All'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{t(`categories.${category.toLowerCase()}`)}</option>
                    ))}
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t('priceRange')}</label>
                  <div className="flex space-x-2">
                    <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-3 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
  
                <div className="col-span-1 md:col-span-2">
                  <FoodFilters
                    isVegetarian={filters.isVegetarian}
                    setIsVegetarian={(v) => handleFilterChange('isVegetarian', v)}
                    minRating={filters.rating ?? 0}
                    setMinRating={(v) => handleFilterChange('rating', v)}
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t('sortBy')}</label>
                  <div className="flex space-x-2">
                    <select
                      value={filters.sortBy || 'rating'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value as 'price' | 'rating' | 'preparationTime')}
                      className="flex-1 px-3 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="rating">{t('rating')}</option>
                      <option value="price">{t('price')}</option>
                      <option value="preparationTime">{t('prepTime')}</option>
                    </select>
                    <select
                      value={filters.sortOrder || 'desc'}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                      className="px-3 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="asc">↑</option>
                      <option value="desc">↓</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="px-4 py-2 text-primary hover:text-primary/80 font-medium">
                  {t('clearFilters')}
                </button>
              </div>
            </div>
          )}
  
          {/* Results */}
          <div className="mb-4">
            <p className="text-muted-foreground">
              {t('resultsFound', { count: filteredItems.length })}
            </p>
          </div>
  
          {/* Food Items Grid */}
          {filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedItems.map((item) => (
                  <FoodCard key={item._id} foodItem={item} />
                ))}
              </div>
              
              {displayedItems.length < filteredItems.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                  >
                    {t('loadMore')} ({filteredItems.length - displayedItems.length} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('noResults')}</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  clearFilters();
                }}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
};
  
export default SearchPage;