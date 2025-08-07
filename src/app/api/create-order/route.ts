// src/app/api/create-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay with your SERVER-SIDE API keys
// These do NOT have the NEXT_PUBLIC_ prefix
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Handles POST requests to create a new Razorpay order.
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR' } = await request.json();

    // Razorpay expects the amount in the smallest currency unit (e.g., paise for INR)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `order_receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Return the successful order details to the frontend
    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    // Provide a more detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Failed to create Razorpay order', details: errorMessage },
      { status: 500 }
    );
  }
}
