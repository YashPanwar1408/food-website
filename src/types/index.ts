export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurant: string | Restaurant;
  rating: number;
  preparationTime: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  deliveryTime: number;
  minimumOrder: number;
  deliveryFee: number;
  isOpen: boolean;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  restaurant: Restaurant;
  totalAmount: number;
  deliveryAddress: Address;
  status: OrderStatus;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  orderDate: Date;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isVegetarian?: boolean;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'preparationTime';
  sortOrder?: 'asc' | 'desc';
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}