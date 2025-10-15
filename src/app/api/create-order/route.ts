
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { amount, currency = 'INR' } = await request.json();

    // Validation
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Amount is required and must be a number' },
        { status: 400 }
      );
    }

    if (amount < 1 || amount > 100000) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount. Must be between ₹1 and ₹100,000' },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `order_receipt_${Date.now()}`,
      notes: {
        user_id: userId,
        created_at: new Date().toISOString(),
      }
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
