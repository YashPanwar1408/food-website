
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { OrderStatus } from '@/types';

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // Get id from context.params
    const { status } = await request.json();

    if (status !== OrderStatus.CANCELLED) {
      return NextResponse.json(
        { success: false, error: 'Invalid status update provided' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: OrderStatus.CANCELLED },
      { new: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(`Error updating order:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Failed to update order', details: errorMessage },
      { status: 500 }
    );
  }
}
