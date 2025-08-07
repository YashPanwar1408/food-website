// src/app/api/seed/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FoodItem from '@/models/FoodItem';
import Restaurant from '@/models/Restaurant';

// This is the mock data with valid 24-character ObjectIDs
const mockRestaurants = [
    { _id: '66a5033c823161571b04b4e9', name: 'Pizza Palace', description: 'The best pizza in town', image: '', address: '', phone: '', email: '', rating: 4.5, deliveryTime: 30, minimumOrder: 200, deliveryFee: 30, isOpen: true, categories: ['Pizza'] },
    { _id: '66a5033c823161571b04b4ea', name: 'Spice Garden', description: 'Authentic Indian biryani', image: '', address: '', phone: '', email: '', rating: 4.7, deliveryTime: 40, minimumOrder: 250, deliveryFee: 40, isOpen: true, categories: ['Biryani', 'Indian'] },
    { _id: '66a5033c823161571b04b4eb', name: 'Curry House', description: 'Flavorful Indian curries', image: '', address: '', phone: '', email: '', rating: 4.4, deliveryTime: 35, minimumOrder: 150, deliveryFee: 30, isOpen: true, categories: ['Indian'] },
    { _id: '66a5033c823161571b04b4ec', name: 'Burger Junction', description: 'Juicy and delicious burgers', image: '', address: '', phone: '', email: '', rating: 4.2, deliveryTime: 25, minimumOrder: 100, deliveryFee: 25, isOpen: true, categories: ['Burger', 'Fast Food'] },
    { _id: '66a5033c823161571b04b4ed', name: 'Dragon Wok', description: 'Sizzling Chinese food', image: '', address: '', phone: '', email: '', rating: 4.3, deliveryTime: 30, minimumOrder: 200, deliveryFee: 35, isOpen: true, categories: ['Chinese'] },
    { _id: '66a5033c823161571b04b4ee', name: 'South Spice', description: 'Traditional South Indian cuisine', image: '', address: '', phone: '', email: '', rating: 4.6, deliveryTime: 25, minimumOrder: 120, deliveryFee: 25, isOpen: true, categories: ['South Indian'] },
    { _id: '66a5033c823161571b04b4ef', name: 'Sweet Treats', description: 'Delicious desserts and ice creams', image: '', address: '', phone: '', email: '', rating: 4.8, deliveryTime: 20, minimumOrder: 80, deliveryFee: 20, isOpen: true, categories: ['Dessert'] },
    { _id: '66a5033c823161571b04b4f0', name: 'Quick Bites', description: 'Your favorite fast food', image: '', address: '', phone: '', email: '', rating: 4.1, deliveryTime: 20, minimumOrder: 100, deliveryFee: 25, isOpen: true, categories: ['Fast Food'] },
];

const mockFoodItems = [
    { _id: '66a50275823161571b04b4d1', name: 'food.margheritaPizza.name', description: 'food.margheritaPizza.desc', price: 299, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400', category: 'Pizza', restaurantName: 'Pizza Palace', rating: 4.5, preparationTime: 25, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4d2', name: 'food.pepperoniPizza.name', description: 'food.pepperoniPizza.desc', price: 349, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category: 'Pizza', restaurantName: 'Pizza Palace', rating: 4.6, preparationTime: 25, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4d3', name: 'food.veggieSupremePizza.name', description: 'food.veggieSupremePizza.desc', price: 329, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', category: 'Pizza', restaurantName: 'Pizza Palace', rating: 4.4, preparationTime: 30, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4d4', name: 'food.chickenBiryani.name', description: 'food.chickenBiryani.desc', price: 349, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: 'Biryani', restaurantName: 'Spice Garden', rating: 4.7, preparationTime: 35, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4d5', name: 'food.muttonBiryani.name', description: 'food.muttonBiryani.desc', price: 399, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400', category: 'Biryani', restaurantName: 'Spice Garden', rating: 4.8, preparationTime: 45, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4d6', name: 'food.vegBiryani.name', description: 'food.vegBiryani.desc', price: 279, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', category: 'Biryani', restaurantName: 'Spice Garden', rating: 4.3, preparationTime: 30, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4d7', name: 'food.paneerButterMasala.name', description: 'food.paneerButterMasala.desc', price: 249, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', category: 'Indian', restaurantName: 'Curry House', rating: 4.3, preparationTime: 20, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4d8', name: 'food.butterChicken.name', description: 'food.butterChicken.desc', price: 299, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', category: 'Indian', restaurantName: 'Curry House', rating: 4.6, preparationTime: 25, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4d9', name: 'food.dalMakhani.name', description: 'food.dalMakhani.desc', price: 199, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'Indian', restaurantName: 'Curry House', rating: 4.4, preparationTime: 15, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4da', name: 'food.chickenBurger.name', description: 'food.chickenBurger.desc', price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'Burger', restaurantName: 'Burger Junction', rating: 4.2, preparationTime: 15, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4db', name: 'food.vegBurger.name', description: 'food.vegBurger.desc', price: 149, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', category: 'Burger', restaurantName: 'Burger Junction', rating: 4.0, preparationTime: 12, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4dc', name: 'food.cheeseBurger.name', description: 'food.cheeseBurger.desc', price: 229, image: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=400', category: 'Burger', restaurantName: 'Burger Junction', rating: 4.3, preparationTime: 15, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4dd', name: 'food.vegHakkaNoodles.name', description: 'food.vegHakkaNoodles.desc', price: 179, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', category: 'Chinese', restaurantName: 'Dragon Wok', rating: 4.1, preparationTime: 18, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4de', name: 'food.chickenFriedRice.name', description: 'food.chickenFriedRice.desc', price: 219, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', category: 'Chinese', restaurantName: 'Dragon Wok', rating: 4.4, preparationTime: 20, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4df', name: 'food.manchurian.name', description: 'food.manchurian.desc', price: 189, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', category: 'Chinese', restaurantName: 'Dragon Wok', rating: 4.2, preparationTime: 22, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e0', name: 'food.masalaDosa.name', description: 'food.masalaDosa.desc', price: 129, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', category: 'South Indian', restaurantName: 'South Spice', rating: 4.5, preparationTime: 15, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e1', name: 'food.idliSambar.name', description: 'food.idliSambar.desc', price: 99, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', category: 'South Indian', restaurantName: 'South Spice', rating: 4.3, preparationTime: 10, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e2', name: 'food.uttapam.name', description: 'food.uttapam.desc', price: 149, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', category: 'South Indian', restaurantName: 'South Spice', rating: 4.2, preparationTime: 18, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e3', name: 'food.chocolateBrownie.name', description: 'food.chocolateBrownie.desc', price: 129, image: 'https://res.cloudinary.com/dykqu1tie/image/upload/v1754395703/Brownie-Recipe-with-Cocoa-Powder_gq7ioe.jpg', category: 'Dessert', restaurantName: 'Sweet Treats', rating: 4.6, preparationTime: 10, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e4', name: 'food.gulabJamun.name', description: 'food.gulabJamun.desc', price: 89, image: 'https://res.cloudinary.com/dykqu1tie/image/upload/v1753794298/gulab_jamun_kmi4w2.jpg', category: 'Dessert', restaurantName: 'Sweet Treats', rating: 4.7, preparationTime: 5, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e5', name: 'food.iceCreamSundae.name', description: 'food.iceCreamSundae.desc', price: 149, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', category: 'Dessert', restaurantName: 'Sweet Treats', rating: 4.4, preparationTime: 8, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e6', name: 'food.frenchFries.name', description: 'food.frenchFries.desc', price: 99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', category: 'Fast Food', restaurantName: 'Quick Bites', rating: 4.1, preparationTime: 8, isVegetarian: true, isAvailable: true },
    { _id: '66a50275823161571b04b4e7', name: 'food.chickenWings.name', description: 'food.chickenWings.desc', price: 249, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category: 'Fast Food', restaurantName: 'Quick Bites', rating: 4.3, preparationTime: 20, isVegetarian: false, isAvailable: true },
    { _id: '66a50275823161571b04b4e8', name: 'food.fishAndChips.name', description: 'food.fishAndChips.desc', price: 299, image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400', category: 'Fast Food', restaurantName: 'Quick Bites', rating: 4.2, preparationTime: 25, isVegetarian: false, isAvailable: true },
];

export async function GET() {
  try {
    await connectToDatabase();
    
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    console.log('Cleared existing restaurants and food items.');

    await Restaurant.insertMany(mockRestaurants);
    console.log('Seeded restaurants.');

    const foodItemsWithRestaurantIds = mockFoodItems.map(item => {
        const restaurant = mockRestaurants.find(r => r.name === item.restaurantName);
        if (!restaurant) throw new Error(`Restaurant not found for item: ${item.name}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { restaurantName, ...rest } = item;
        return { ...rest, restaurant: restaurant._id };
    });

    await FoodItem.insertMany(foodItemsWithRestaurantIds);
    console.log('Seeded food items with restaurant references.');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: errorMessage },
      { status: 500 }
    );
  }
}
