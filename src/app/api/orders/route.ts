import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const orders = await Order.find({ userId })
      .populate({
        path: 'items.foodItem',
        model: 'FoodItem',
        populate: {
          path: 'restaurant',
          model: 'Restaurant'
        }
      })
      .populate('restaurant')
      .sort({ orderDate: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}