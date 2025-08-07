import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { Address } from '@/types';

interface RequestItem {
  foodItem: string;
  quantity: number;
}

interface RequestBody {
  paymentId: string;
  orderId: string;
  signature: string;
  items: RequestItem[];
  totalAmount: number;
  address: Address;
  userId: string;
  userEmail: string;
  userName: string;
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
    } = (await request.json()) as RequestBody;

    await connectToDatabase();

    const order = new Order({
      userId,
      userEmail,
      userName,
      items,
      // FIX: Removed the 'restaurant' field to match the updated model.
      totalAmount,
      deliveryAddress: address,
      paymentId,
      razorpayOrderId: orderId,
      paymentSignature: signature,
      status: 'confirmed',
      paymentStatus: 'completed', // FIX: Set payment status to completed on success.
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