'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { Star, Clock, Plus } from 'lucide-react';
import { FoodItem } from '@/types';
import { useCart } from '@/context/CartContext';

interface FoodCardProps {
  foodItem: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => {
  const { t } = useTranslation();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(foodItem);
  };

  return (
    <Link href={`/food/${foodItem._id}`}>
      <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-border">
        {/* Food Image */}
        <div className="relative h-48 w-full">
          <Image
            src={foodItem.image}
            alt={`${t(foodItem.name)} - a delicious food item`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {foodItem.isVegetarian && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {t('vegetarianLabel')}
            </div>
          )}
          {!foodItem.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{t('outOfStock')}</span>
            </div>
          )}
        </div>

        {/* Food Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {t(foodItem.name)}
            </h3>
            <span className="text-lg font-bold text-primary">
              ₹{foodItem.price}
            </span>
          </div>

          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {t(foodItem.description)}
          </p>

          {/* Rating and Time */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-muted-foreground">
                {foodItem.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {foodItem.preparationTime} {t('minutes')}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="mb-3">
            <span className="inline-block bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
              {/* FIX: Added .toLowerCase() to match the translation key correctly */}
              <span>{t(`categories.${foodItem.category.replace(/\s/g, '').toLowerCase()}`)}</span>
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!foodItem.isAvailable}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors border border-foreground/50 text-foreground hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            <span>{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;