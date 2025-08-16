import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');
    if (!clerkId) {
      return NextResponse.json({ success: false, error: 'clerkId is required' }, { status: 400 });
    }
    await connectToDatabase();
    let user = await User.findOne({ clerkId }).lean();
    if (!user) {
      // Create user if not found
      user = await User.create({
        clerkId,
        email: searchParams.get('email') || '',
        firstName: searchParams.get('firstName') || '',
        lastName: searchParams.get('lastName') || '',
        phone: '',
        addresses: [],
        orders: [],
        profileImage: ''
      });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch profile', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}