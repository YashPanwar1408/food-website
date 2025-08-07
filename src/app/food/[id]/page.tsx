'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Clock, ArrowLeft, Plus, Minus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { FoodItem } from '@/types';
import { useCart } from '@/context/CartContext';

// This data uses translation keys. The actual text is in your i18n.ts file.
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

const FoodDetailPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const item = mockFoodItems.find(item => item._id === id);
    setFoodItem(item ? (item as FoodItem) : null);
    setLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (foodItem) {
      for (let i = 0; i < quantity; i++) {
        addItem(foodItem);
      }
      router.push('/cart');
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    // This is a basic loader. You can replace it with a more sophisticated skeleton loader.
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Food Item Not Found</h1>
          <button
            onClick={() => router.back()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{t('back')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={foodItem.image}
              alt={t(foodItem.name)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {t(foodItem.name)}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t(foodItem.description)}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold text-foreground">
                  {foodItem.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {foodItem.preparationTime} {t('minutes')}
                </span>
              </div>
            </div>

            <div>
              <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                {/* FIX: This now correctly translates the category */}
                {t(`categories.${foodItem.category.replace(/\s/g, '').toLowerCase()}`)}
              </span>
            </div>

            <div className="text-4xl font-bold text-primary">
              ₹{foodItem.price}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-foreground">{t('quantity')}:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decreaseQuantity}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors border border-foreground/50 text-foreground hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4 text-foreground" />
                </button>
                <span className="text-xl font-semibold min-w-[3rem] text-center text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors border border-foreground/50 text-foreground hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 text-foreground" />
                </button>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">{t('total')}:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{(foodItem.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!foodItem.isAvailable}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors border border-foreground/50 text-foreground hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {foodItem.isAvailable ? t('addToCart') : t('outOfStock')}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FoodDetailPage;