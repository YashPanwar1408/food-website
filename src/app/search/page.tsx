'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import { FoodItem, SearchFilters } from '@/types';

// Mock data - complete list with all 24 items
const mockFoodItems: FoodItem[] = [
  // Pizza Category
  {
    _id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil',
    price: 299,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'Pizza',
    restaurant: 'Pizza Palace',
    rating: 4.5,
    preparationTime: 25,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Pepperoni Pizza',
    description: 'Delicious pizza topped with pepperoni and mozzarella cheese',
    price: 349,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    category: 'Pizza',
    restaurant: 'Pizza Palace',
    rating: 4.6,
    preparationTime: 25,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Veggie Supreme Pizza',
    description: 'Loaded with bell peppers, mushrooms, onions, and olives',
    price: 329,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400',
    category: 'Pizza',
    restaurant: 'Pizza Palace',
    rating: 4.4,
    preparationTime: 30,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Biryani Category
  {
    _id: '4',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken and spices',
    price: 349,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    category: 'Biryani',
    restaurant: 'Spice Garden',
    rating: 4.7,
    preparationTime: 35,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    name: 'Mutton Biryani',
    description: 'Rich and flavorful biryani with tender mutton pieces',
    price: 399,
    image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400',
    category: 'Biryani',
    restaurant: 'Spice Garden',
    rating: 4.8,
    preparationTime: 45,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6',
    name: 'Veg Biryani',
    description: 'Fragrant vegetable biryani with mixed vegetables and saffron',
    price: 279,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    category: 'Biryani',
    restaurant: 'Spice Garden',
    rating: 4.3,
    preparationTime: 30,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Indian Category
  {
    _id: '7',
    name: 'Paneer Butter Masala',
    description: 'Creamy tomato-based curry with soft paneer cubes',
    price: 249,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    category: 'Indian',
    restaurant: 'Curry House',
    rating: 4.3,
    preparationTime: 20,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '8',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich, creamy tomato-based sauce',
    price: 299,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400',
    category: 'Indian',
    restaurant: 'Curry House',
    rating: 4.6,
    preparationTime: 25,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '9',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in creamy, buttery gravy',
    price: 199,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    category: 'Indian',
    restaurant: 'Curry House',
    rating: 4.4,
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Burger Category
  {
    _id: '10',
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken patty with lettuce, tomato, and mayo',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'Burger',
    restaurant: 'Burger Junction',
    rating: 4.2,
    preparationTime: 15,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '11',
    name: 'Veg Burger',
    description: 'Crispy vegetable patty with fresh lettuce and special sauce',
    price: 149,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
    category: 'Burger',
    restaurant: 'Burger Junction',
    rating: 4.0,
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '12',
    name: 'Cheese Burger',
    description: 'Classic beef patty with melted cheese and pickles',
    price: 229,
    image: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=400',
    category: 'Burger',
    restaurant: 'Burger Junction',
    rating: 4.3,
    preparationTime: 15,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Chinese Category
  {
    _id: '13',
    name: 'Veg Hakka Noodles',
    description: 'Stir-fried noodles with fresh vegetables and soy sauce',
    price: 179,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    category: 'Chinese',
    restaurant: 'Dragon Wok',
    rating: 4.1,
    preparationTime: 18,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '14',
    name: 'Chicken Fried Rice',
    description: 'Wok-tossed rice with chicken, vegetables, and soy sauce',
    price: 219,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    category: 'Chinese',
    restaurant: 'Dragon Wok',
    rating: 4.4,
    preparationTime: 20,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '15',
    name: 'Manchurian',
    description: 'Deep-fried vegetable balls in tangy Manchurian sauce',
    price: 189,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    category: 'Chinese',
    restaurant: 'Dragon Wok',
    rating: 4.2,
    preparationTime: 22,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // South Indian Category
  {
    _id: '16',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato curry',
    price: 129,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
    category: 'South Indian',
    restaurant: 'South Spice',
    rating: 4.5,
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '17',
    name: 'Idli Sambar',
    description: 'Steamed rice cakes served with lentil curry and chutney',
    price: 99,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
    category: 'South Indian',
    restaurant: 'South Spice',
    rating: 4.3,
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '18',
    name: 'Uttapam',
    description: 'Thick pancake topped with vegetables and served with chutney',
    price: 149,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
    category: 'South Indian',
    restaurant: 'South Spice',
    rating: 4.2,
    preparationTime: 18,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Dessert Category
  {
    _id: '19',
    name: 'Chocolate Brownie',
    description: 'Rich and fudgy chocolate brownie with vanilla ice cream',
    price: 129,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    category: 'Dessert',
    restaurant: 'Sweet Treats',
    rating: 4.6,
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '20',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
    price: 89,
    image: 'https://res.cloudinary.com/dykqu1tie/image/upload/v1753794298/gulab_jamun_kmi4w2.jpg',
    category: 'Dessert',
    restaurant: 'Sweet Treats',
    rating: 4.7,
    preparationTime: 5,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '21',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce, nuts, and cherry',
    price: 149,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    category: 'Dessert',
    restaurant: 'Sweet Treats',
    rating: 4.4,
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Fast Food Category
  {
    _id: '22',
    name: 'French Fries',
    description: 'Crispy golden fries served with ketchup and mayo',
    price: 99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    category: 'Fast Food',
    restaurant: 'Quick Bites',
    rating: 4.1,
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '23',
    name: 'Chicken Wings',
    description: 'Spicy buffalo chicken wings with ranch dipping sauce',
    price: 249,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    category: 'Fast Food',
    restaurant: 'Quick Bites',
    rating: 4.3,
    preparationTime: 20,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '24',
    name: 'Fish and Chips',
    description: 'Battered fish fillet with crispy chips and tartar sauce',
    price: 299,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400',
    category: 'Fast Food',
    restaurant: 'Quick Bites',
    rating: 4.2,
    preparationTime: 25,
    isVegetarian: false,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const categories = ['All', 'Pizza', 'Biryani', 'Indian', 'Chinese', 'Burger', 'South Indian', 'Dessert', 'Fast Food'];

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
    rating: undefined,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  useEffect(() => {
    filterAndSortItems();
  }, [searchQuery, filters]);

  useEffect(() => {
    setDisplayedItems(filteredItems.slice(0, itemsToShow));
  }, [filteredItems, itemsToShow]);

  const filterAndSortItems = () => {
    let items = [...mockFoodItems];

    // Text search
    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof item.restaurant === 'string' && 
         item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()))
      );
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

    // Vegetarian filter
    if (filters.isVegetarian !== undefined) {
      items = items.filter(item => item.isVegetarian === filters.isVegetarian);
    }

    // Rating filter
    if (filters.rating !== undefined) {
      items = items.filter(item => item.rating >= filters.rating!);
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

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      minPrice: undefined,
      maxPrice: undefined,
      isVegetarian: undefined,
      rating: undefined,
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

              {/* Vegetarian Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Diet</label>
                <select
                  value={filters.isVegetarian === undefined ? 'all' : filters.isVegetarian.toString()}
                  onChange={(e) => handleFilterChange('isVegetarian', e.target.value === 'all' ? undefined : e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                >
                  <option value="all">All</option>
                  <option value="true">Vegetarian</option>
                  <option value="false">Non-Vegetarian</option>
                </select>
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