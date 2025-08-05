// src/app/api/create-order-record/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { CartItem, Address } from '@/types';

// Define a type for the item in the request body
interface RequestBody {
  paymentId: string;
  orderId: string;
  signature: string;
  items: {
    foodItem: string;
    quantity: number;
  }[];
  totalAmount: number;
  address: Address;
  userId: string;
  userEmail: string;
  userName: string;
  restaurant: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      paymentId,
      orderId,
      signature,
      items,
      totalAmount,
      address,
      userId,
      userEmail,
      userName,
      restaurant,
    } = (await request.json()) as RequestBody;

    await connectToDatabase();

    // Create order record
    const order = new Order({
      userId,
      userEmail,
      userName,
      items: items.map(item => ({
        foodItem: item.foodItem,
        quantity: item.quantity,
      })),
      restaurant: restaurant,
      totalAmount,
      deliveryAddress: address,
      paymentId,
      razorpayOrderId: orderId,
      paymentSignature: signature,
      status: 'confirmed',
      orderDate: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order record' },
      { status: 500 }
    );
  }
}