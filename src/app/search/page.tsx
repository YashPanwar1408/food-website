// src/app/search/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import { FoodItem, SearchFilters } from '@/types';
import FoodFilters from '@/components/FoodFilters';

// ... (mockFoodItems and categories data remain the same)

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<FoodItem[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || 'All',
    minPrice: undefined,
    maxPrice: undefined,
    isVegetarian: undefined,
    rating: 0,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const filterAndSortItems = () => {
    let items = [...mockFoodItems];

    // Text search
    if (searchQuery.trim()) {
      items = items.filter(item => {
        const restaurantName = typeof item.restaurant === 'string' ? item.restaurant : item.restaurant.name;
        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      items = items.filter(item => item.category === filters.category);
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      items = items.filter(item => item.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      items = items.filter(item => item.price <= filters.maxPrice!);
    }

    // Sorting
    if (filters.sortBy) {
      items.sort((a, b) => {
        let aValue: number;
        let bValue: number;

        switch (filters.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'preparationTime':
            aValue = a.preparationTime;
            bValue = b.preparationTime;
            break;
          default:
            return 0;
        }

        return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    setFilteredItems(items);
  };
  
  useEffect(() => {
    filterAndSortItems();
  }, [searchQuery, filters]);

  useEffect(() => {
    setDisplayedItems(filteredItems.slice(0, itemsToShow));
  }, [filteredItems, itemsToShow]);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | boolean | undefined) => {
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Search Food Items'}
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                <select
                  value={filters.category || 'All'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Veg/Non-Veg & Rating Filters (Reusable) */}
              <div className="col-span-2">
                <FoodFilters
                  isVegetarian={filters.isVegetarian}
                  setIsVegetarian={(v) => handleFilterChange('isVegetarian', v)}
                  minRating={filters.rating ?? 0}
                  setMinRating={(v) => handleFilterChange('rating', v)}
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Sort By</label>
                <div className="flex space-x-2">
                  <select
                    value={filters.sortBy || 'rating'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  >
                    <option value="rating">Rating</option>
                    <option value="price">Price</option>
                    <option value="preparationTime">Prep Time</option>
                  </select>
                  <select
                    value={filters.sortOrder || 'desc'}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  >
                    <option value="asc">↑</option>
                    <option value="desc">↓</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {/* Food Items Grid */}
        {filteredItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedItems.map((item) => (
                <FoodCard key={item._id} foodItem={item} />
              ))}
            </div>
            
            {/* Load More Button */}
            {displayedItems.length < filteredItems.length && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                >
                  Load More ({filteredItems.length - displayedItems.length} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearFilters();
              }}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;