
import mongoose, { Schema } from 'mongoose';
import { Order as IOrder, CartItem, Address, OrderStatus, PaymentStatus } from '@/types';

const AddressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  landmark: { type: String }
});

const CartItemSchema = new Schema<CartItem>({
  foodItem: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  items: [CartItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  deliveryAddress: { type: AddressSchema, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  // We only need a generic paymentId now
  paymentId: { type: String },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  orderDate: { type: Date, default: Date.now },
  estimatedDeliveryTime: { type: Date, required: true },
  actualDeliveryTime: { type: Date }
}, {
  timestamps: true
});

OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderDate: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);