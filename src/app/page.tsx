'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import RegionSelector from '@/components/RegionSelector';
import { FoodItem } from '@/types';
import FoodFilters from '@/components/FoodFilters';

// Mock data for demonstration (now uses translation keys)
const mockFoodItems: FoodItem[] = [
  // Pizza Category
  {
    _id: '1',
    name: 'food.frenchFries.name',
    description: 'food.frenchFries.desc',
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
    name: 'food.pepperoniPizza.name',
    description: 'food.pepperoniPizza.desc',
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
    name: 'food.veggieSupremePizza.name',
    description: 'food.veggieSupremePizza.desc',
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
    name: 'food.fishAndChips.name',
    description: 'food.fishAndChips.desc',
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
    name: 'food.muttonBiryani.name',
    description: 'food.muttonBiryani.desc',
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
    name: 'food.vegBiryani.name',
    description: 'food.vegBiryani.desc',
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
    name: 'food.iceCreamSundae.name',
    description: 'food.iceCreamSundae.desc',
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
    name: 'food.chickenWings.name',
    description: 'food.chickenWings.desc',
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
    name: 'food.dalMakhani.name',
    description: 'food.dalMakhani.desc',
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
    name: 'food.chickenBurger.name',
    description: 'food.chickenBurger.desc',
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
    name: 'food.vegBurger.name',
    description: 'food.vegBurger.desc',
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
    name: 'food.cheeseBurger.name',
    description: 'food.cheeseBurger.desc',
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
    name: 'food.vegHakkaNoodles.name',
    description: 'food.vegHakkaNoodles.desc',
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
    name: 'food.chickenFriedRice.name',
    description: 'food.chickenFriedRice.desc',
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
    name: 'food.manchurian.name',
    description: 'food.manchurian.desc',
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
    name: 'food.masalaDosa.name',
    description: 'food.masalaDosa.desc',
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
    name: 'food.idliSambar.name',
    description: 'food.idliSambar.desc',
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
    name: 'food.uttapam.name',
    description: 'food.uttapam.desc',
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
    name: 'food.chocolateBrownie.name',
    description: 'food.chocolateBrownie.desc',
    price: 129,
    image: 'https://res.cloudinary.com/dykqu1tie/image/upload/v1754395703/Brownie-Recipe-with-Cocoa-Powder_gq7ioe.jpg',
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
    name: 'food.gulabJamun.name',
    description: 'food.gulabJamun.desc',
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
    _id: '3',
    name: 'food.veggieSupremePizza.name',
    description: 'food.veggieSupremePizza.desc',
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
  // ...repeat for all food items, using translation keys for name/desc
];

const mockRegions = [
  'Delhi NCR',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata'
];

const regionOffers: Record<string, string> = {
  'Delhi NCR': 'Get 20% off on all Pizza orders!',
  'Mumbai': 'Free dessert with every Biryani!',
  'Bangalore': 'Flat ₹50 off on orders above ₹499.',
  'Hyderabad': 'Buy 1 Get 1 Free on South Indian dishes!',
  'Chennai': '10% off for first-time users.',
  'Kolkata': 'Free delivery on Fast Food orders!'
};

export default function Home() {
  const { t } = useTranslation();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>(mockRegions[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isVegetarian, setIsVegetarian] = useState<boolean | undefined>(undefined);
  const [minRating, setMinRating] = useState<number>(0);
  const itemsPerPage = 8;

  useEffect(() => {
    setTimeout(() => {
      setFoodItems(mockFoodItems);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtering logic
  const filteredItems = foodItems.filter(item => {
    const vegMatch = isVegetarian === undefined ? true : item.isVegetarian === isVegetarian;
    const ratingMatch = item.rating >= minRating;
    return vegMatch && ratingMatch;
  });
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categories = [
    { name: t('categories.pizza'), icon: '🍕', count: foodItems.filter(item => item.category === 'Pizza').length },
    { name: t('categories.biryani'), icon: '🍛', count: foodItems.filter(item => item.category === 'Biryani').length },
    { name: t('categories.indian'), icon: '🍛', count: foodItems.filter(item => item.category === 'Indian').length },
    { name: t('categories.chinese'), icon: '🥡', count: foodItems.filter(item => item.category === 'Chinese').length },
    { name: t('categories.burger'), icon: '🍔', count: foodItems.filter(item => item.category === 'Burger').length },
    { name: t('categories.southIndian'), icon: '🥞', count: foodItems.filter(item => item.category === 'South Indian').length },
    { name: t('categories.dessert'), icon: '🍰', count: foodItems.filter(item => item.category === 'Dessert').length },
    { name: t('categories.fastFood'), icon: '🍟', count: foodItems.filter(item => item.category === 'Fast Food').length },
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
          className="absolute inset-0 w-full z-10 h-full object-cover opacity-30"
        >
          <source src="https://res.cloudinary.com/dykqu1tie/video/upload/v1753770094/123629-728697948_medium_th7ywr.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-red-600/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">{t('homepage.heroTitle')}</h1>
          <p className="text-xl mb-8">{t('homepage.heroSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('food-items')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {t('orderNow')}
            </button>
            <button
              onClick={() => document.getElementById('food-items')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              {t('viewMenu')}
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t('homepage.browseByCategory')}</h2>
          <p className="text-foreground mb-12">{t('homepage.categorySubtitle')}</p>
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
              <p className="text-sm text-muted-foreground">{category.count} {t('items')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">{t('homepage.whyChoose')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon="⚡" title={t('homepage.fastDelivery')} desc={t('homepage.fastDeliveryDesc')} />
            <Feature icon="🍽️" title={t('homepage.qualityFood')} desc={t('homepage.qualityFoodDesc')} />
            <Feature icon="💳" title={t('homepage.easyPayment')} desc={t('homepage.easyPaymentDesc')} />
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
          <h2 className="text-3xl font-bold mb-8">{t('homepage.popularItems')}</h2>
          <p className="mb-12">{t('homepage.popularItemsSubtitle')}</p>
        </div>

        {/* Food Filters */}
        <FoodFilters
          isVegetarian={isVegetarian}
          setIsVegetarian={setIsVegetarian}
          minRating={minRating}
          setMinRating={setMinRating}
        />

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
            : paginatedItems.map((item) => <FoodCard key={item._id} foodItem={{ ...item, name: t(item.name), description: t(item.description) }} />)}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-orange-100 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('previous')}
          </button>
          <span className="mx-2 font-bold text-gray-700">{t('page')} {currentPage} {t('of')} {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-orange-100 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('next')}
          </button>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/search'}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            {t('viewAllItems')}
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
    <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
