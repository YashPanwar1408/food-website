'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Plus } from 'lucide-react';
import { FoodItem } from '@/types';
import { useCart } from '@/context/CartContext';

interface FoodCardProps {
  foodItem: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(foodItem);
  };

  return (
    <Link href={`/food/${foodItem._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* Food Image */}
        <div className="relative h-48 w-full">
          <Image
            src={foodItem.image}
            alt={foodItem.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {foodItem.isVegetarian && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              VEG
            </div>
          )}
          {!foodItem.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Food Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {foodItem.name}
            </h3>
            <span className="text-lg font-bold text-orange-600">
              ₹{foodItem.price}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {foodItem.description}
          </p>

          {/* Rating and Time */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {foodItem.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {foodItem.preparationTime} mins
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {foodItem.category}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!foodItem.isAvailable}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-colors ${
              foodItem.isAvailable
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;