import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const clerkId = formData.get('clerkId');
    if (!clerkId) {
      return NextResponse.json({ success: false, error: 'clerkId is required' }, { status: 400 });
    }
    const firstName = formData.get('firstName') || '';
    const lastName = formData.get('lastName') || '';
    const phone = formData.get('phone') || '';
    let profileImageUrl = '';
    const profileImage = formData.get('profileImage');
    if (profileImage && typeof profileImage !== 'string') {
      // Upload image to Cloudinary
      const buffer = await profileImage.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64}`);
      profileImageUrl = uploadResponse.secure_url;
    } else if (profileImage === '') {
      profileImageUrl = '';
    }
    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        firstName,
        lastName,
        phone,
        ...(profileImageUrl !== '' ? { profileImage: profileImageUrl } : {}),
      },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update profile', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}