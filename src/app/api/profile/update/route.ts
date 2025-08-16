import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const clerkId = formData.get('clerkId');
    console.log('Received clerkId:', clerkId);

    if (!clerkId) {
      return NextResponse.json({ success: false, error: 'clerkId is required' }, { status: 400 });
    }
    await connectToDatabase();
    let profileImageUrl = undefined;
    const profileImageFile = formData.get('profileImage');
    console.log('Received profileImageFile:', profileImageFile);

    if (profileImageFile === '') { // User wants to remove profile image
      profileImageUrl = '';
    } else if (profileImageFile && typeof profileImageFile === 'object' && 'arrayBuffer' in profileImageFile) {
      try {
        const buffer = Buffer.from(await profileImageFile.arrayBuffer());
        console.log('Buffer created for image upload.');
        profileImageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error || new Error('Cloudinary upload failed'));
            }
            if (!result || !result.secure_url) {
              reject(new Error('Cloudinary upload failed: no result'));
            } else {
              console.log('Cloudinary upload successful, secure_url:', result.secure_url);
              resolve(result.secure_url);
            }
          });
          stream.end(buffer);
        });
      } catch (err) {
        console.error('Error during Cloudinary upload process:', err);
        return NextResponse.json({ success: false, error: 'Cloudinary upload failed', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
      }
    }
    const updateFields = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      ...(profileImageUrl !== undefined ? { profileImage: profileImageUrl } : {}),
    };
    console.log('Update fields:', updateFields);

    const user = await User.findOneAndUpdate({ clerkId }, updateFields, { new: true }).lean();
    console.log('User after update:', user);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('General error in PUT /api/profile/update:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}