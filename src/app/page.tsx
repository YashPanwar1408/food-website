'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import RegionSelector from '@/components/RegionSelector';
import { FoodItem } from '@/types';

// Mock data for demonstration
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
    isAvailable: false,
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

const mockRegions = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata"
];

const regionOffers: Record<string, string> = {
  "Delhi NCR": "Get 20% off on all Pizza orders!",
  "Mumbai": "Free dessert with every Biryani!",
  "Bangalore": "Flat ₹50 off on orders above ₹499.",
  "Hyderabad": "Buy 1 Get 1 Free on South Indian dishes!",
  "Chennai": "10% off for first-time users.",
  "Kolkata": "Free delivery on Fast Food orders!"
};

export default function Home() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>(mockRegions[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setTimeout(() => {
      setFoodItems(mockFoodItems);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = foodItems;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categories = [
    { name: 'Pizza', icon: '🍕', count: foodItems.filter(item => item.category === 'Pizza').length },
    { name: 'Biryani', icon: '🍛', count: foodItems.filter(item => item.category === 'Biryani').length },
    { name: 'Indian', icon: '🍛', count: foodItems.filter(item => item.category === 'Indian').length },
    { name: 'Chinese', icon: '🥡', count: foodItems.filter(item => item.category === 'Chinese').length },
    { name: 'Burger', icon: '🍔', count: foodItems.filter(item => item.category === 'Burger').length },
    { name: 'South Indian', icon: '🥞', count: foodItems.filter(item => item.category === 'South Indian').length },
    { name: 'Dessert', icon: '🍰', count: foodItems.filter(item => item.category === 'Dessert').length },
    { name: 'Fast Food', icon: '🍟', count: foodItems.filter(item => item.category === 'Fast Food').length },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-orange-600 text-foreground py-20 text-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="https://res.cloudinary.com/dykqu1tie/video/upload/v1753770094/123629-728697948_medium_th7ywr.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-red-600/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Delicious Food, Delivered Fast</h1>
          <p className="text-xl mb-8">Order from your favorite restaurants and get it delivered to your doorstep in minutes</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('food-items')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Order Now
            </button>
            <button
              onClick={() => document.getElementById('food-items')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Browse by Category</h2>
          <p className="text-foreground mb-12">Find your favorite cuisine from our wide selection</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => window.location.href = `/search?category=${encodeURIComponent(category.name)}`}
              className="bg-card rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
              <h3 className="font-semibold text-card-foreground mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count} items</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">Why Choose FoodDelivery?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon="⚡" title="Fast Delivery" desc="Get your food delivered in 30 minutes or less" />
            <Feature icon="🍽️" title="Quality Food" desc="Fresh ingredients and top-rated restaurants" />
            <Feature icon="💳" title="Easy Payment" desc="Multiple payment options for your convenience" />
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div id="food-items" className="max-w-7xl text-foreground mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <RegionSelector
          regions={mockRegions}
          selectedRegion={selectedRegion}
          onRegionChange={(region) => {
            setSelectedRegion(region);
            setCurrentPage(1);
          }}
        />
        <div className="mb-8 text-center">
          <span className="inline-block bg-orange-100 text-orange-700 px-6 py-2 rounded-full font-semibold text-lg shadow">
            {regionOffers[selectedRegion]}
          </span>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">Popular Food Items</h2>
          <p className="mb-12">Discover what everyone else is loving</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? [...Array(itemsPerPage)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            : paginatedItems.map((item) => <FoodCard key={item._id} foodItem={item} />)}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-orange-100 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          <span className="mx-2 font-bold text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-orange-100 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/search'}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            View All Items
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Internal component for features
function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
