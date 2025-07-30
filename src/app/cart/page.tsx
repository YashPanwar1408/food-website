'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { state, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some delicious food items to get started!</p>
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            >
              Browse Food Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>
        
        <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
          {/* Cart Items */}
          <div className="divide-y divide-border">
            {state.items.map((item) => (
              <div key={item.foodItem._id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Food Image */}
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Food Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.foodItem.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {typeof item.foodItem.restaurant === 'string'
                        ? item.foodItem.restaurant
                        : item.foodItem.restaurant.name}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      ₹{item.foodItem.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.foodItem._id, item.quantity - 1)}
                      className="p-1 rounded-full bg-accent hover:bg-accent-hover transition-colors"
                    >
                      <Minus className="h-4 w-4 text-foreground" />
                    </button>
                    <span className="text-lg font-semibold min-w-[2rem] text-center text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.foodItem._id, item.quantity + 1)}
                      className="p-1 rounded-full bg-accent hover:bg-accent-hover transition-colors"
                    >
                      <Plus className="h-4 w-4 text-foreground" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      ₹{(item.foodItem.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.foodItem._id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-background p-6 border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-foreground">
                Total Items: {state.totalItems}
              </span>
              <span className="text-2xl font-bold text-foreground">
                ₹{state.totalAmount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex space-x-4">
              <Link
                href="/"
                className="flex-1 bg-muted text-muted-foreground py-3 px-6 rounded-lg font-semibold text-center hover:bg-muted-foreground/10 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/checkout"
                className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold text-center hover:bg-primary-hover transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;