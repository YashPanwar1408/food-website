import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { FoodItem } from '@/types';

// Define a type for the item in the request body
interface RequestItem {
  foodItem: FoodItem;
  quantity: number;
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
    } = await request.json();

    await connectToDatabase();

    // Create order record
    const order = new Order({
      userId,
      userEmail,
      userName,
      items: items.map((item: RequestItem) => ({
        foodItem: item.foodItem._id,
        foodItemName: item.foodItem.name,
        quantity: item.quantity,
        price: item.foodItem.price,
      })),
      totalAmount,
      address,
      paymentId,
      razorpayOrderId: orderId,
      paymentSignature: signature,
      status: 'confirmed',
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
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