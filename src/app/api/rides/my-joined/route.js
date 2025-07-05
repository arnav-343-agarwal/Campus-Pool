import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import { authMiddleware } from '@/middleware/auth';
import { NextResponse } from 'next/server';

async function handler(req, user) {
  try {
    await connectDB();

    const userId = user.id; // ✅ THIS LINE FIXED
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const rides = await Ride.find({ members: userId })
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ rides }, { status: 200 });
  } catch (err) {
    console.error('Error in my-joined API:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);
