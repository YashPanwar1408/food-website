import mongoose, { Schema } from 'mongoose';
import { Restaurant as IRestaurant } from '@/types';

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  deliveryTime: { type: Number, required: true }, // in minutes
  minimumOrder: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  isOpen: { type: Boolean, default: true },
  categories: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);