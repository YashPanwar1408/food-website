import mongoose, { Schema } from 'mongoose';
import { FoodItem as IFoodItem } from '@/types';

const FoodItemSchema = new Schema<IFoodItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  preparationTime: { type: Number, required: true }, // in minutes
  isVegetarian: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index for better search performance
FoodItemSchema.index({ name: 'text', description: 'text', category: 'text' });
FoodItemSchema.index({ category: 1 });
FoodItemSchema.index({ restaurant: 1 });
FoodItemSchema.index({ price: 1 });
FoodItemSchema.index({ rating: -1 });

export default mongoose.models.FoodItem || mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);