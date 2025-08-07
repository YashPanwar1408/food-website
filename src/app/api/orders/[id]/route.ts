// src/app/api/orders/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { OrderStatus } from '@/types';

/**
 * Handles PATCH requests to update a single order's status (e.g., for cancellation).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // For security, only allow updating the status to 'cancelled' via this endpoint.
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
      { new: true } // This option ensures the updated document is returned
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
    console.error(`Error updating order ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Failed to update order', details: errorMessage },
      { status: 500 }
    );
  }
}
