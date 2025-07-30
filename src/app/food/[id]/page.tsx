'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Clock, ArrowLeft, Plus, Minus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FoodItem } from '@/types';
import { useCart } from '@/context/CartContext';

// Mock data - complete list with all 24 items and working images
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

const FoodDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch food item
    const id = params.id as string;
    setTimeout(() => {
      const item = mockFoodItems.find(item => item._id === id);
      setFoodItem(item || null);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleAddToCart = () => {
    if (foodItem) {
      for (let i = 0; i < quantity; i++) {
        addItem(foodItem);
      }
      router.push('/cart');
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-6 w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Food Item Not Found</h1>
            <button
              onClick={() => router.back()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Food Image */}
          <div className="relative">
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={foodItem.image}
                alt={foodItem.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {foodItem.isVegetarian && (
                <div className="absolute top-4 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  VEG
                </div>
              )}
              {!foodItem.isAvailable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Food Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">
                {foodItem.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {foodItem.description}
              </p>
            </div>

            {/* Restaurant Info */}
            <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-2">Restaurant</h3>
              <p className="text-muted-foreground">
                {typeof foodItem.restaurant === 'string' 
                  ? foodItem.restaurant 
                  : foodItem.restaurant.name}
              </p>
            </div>

            {/* Rating and Time */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-warning fill-current" />
                <span className="text-lg font-semibold text-foreground">
                  {foodItem.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {foodItem.preparationTime} mins
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <span className="inline-block bg-warning-foreground text-warning px-3 py-1 rounded-full text-sm font-medium">
                {foodItem.category}
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              ₹{foodItem.price}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-foreground">Quantity:</span>
              <div className="flex items-center space-x-3">
                <button
                   onClick={decreaseQuantity}
                   className="p-2 rounded-full bg-accent hover:bg-accent-hover transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4 text-foreground" />
                </button>
                <span className="text-xl font-semibold min-w-[3rem] text-center text-foreground">
                  {quantity}
                </span>
                <button
                   onClick={increaseQuantity}
                   className="p-2 rounded-full bg-accent hover:bg-accent-hover transition-colors"
                >
                  <Plus className="h-4 w-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{(foodItem.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!foodItem.isAvailable}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                foodItem.isAvailable
                  ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {foodItem.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FoodDetailPage;