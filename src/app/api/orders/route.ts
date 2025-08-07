import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import FoodItem from '@/models/FoodItem';
import mongoose from 'mongoose';

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

    // Ensure the FoodItem model is registered
    if (!mongoose.models.FoodItem) {
      mongoose.model('FoodItem', FoodItem.schema);
    }

    // Fetch orders and populate the foodItem details for each item in the order
    const orders = await Order.find({ userId })
      .populate({
        path: 'items.foodItem',
        model: 'FoodItem',
      })
      .sort({ orderDate: -1 }) // Show the newest orders first
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: errorMessage },
      { status: 500 }
    );
  }
}