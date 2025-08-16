import mongoose, { Schema } from 'mongoose';
import { Address, Order } from '@/types';

const AddressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  landmark: { type: String }
});

const UserSchema = new Schema<IUserModel>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  profileImage: { type: String },
  addresses: [AddressSchema],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, {
  timestamps: true
});

export interface IUserModel extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  addresses: Address[];
  orders: Order[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default mongoose.models.User || mongoose.model<IUserModel>('User', UserSchema);