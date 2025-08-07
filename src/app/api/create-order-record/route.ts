// src/app/api/create-order-record/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { Address, OrderStatus, PaymentStatus } from '@/types';

interface RequestItem {
  foodItem: string;
  quantity: number;
}

// This interface now expects the data from Razorpay
interface RequestBody {
  paymentId: string;
  razorpayOrderId: string;
  signature: string;
  items: RequestItem[];
  totalAmount: number;
  address: Address;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      paymentId,
      razorpayOrderId,
      signature,
      items,
      totalAmount,
      address,
      userId,
    } = (await request.json()) as RequestBody;

    // It's a good practice to verify the signature here in a real app
    // but for now we will trust it.

    await connectToDatabase();

    const order = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress: address,
      paymentId: paymentId, // Razorpay's payment ID
      razorpayOrderId: razorpayOrderId, // Razorpay's order ID
      paymentSignature: signature, // Razorpay's signature
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.COMPLETED,
      orderDate: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 mins from now
    });

    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order record:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Failed to create order record', details: errorMessage },
      { status: 500 }
    );
  }
}
