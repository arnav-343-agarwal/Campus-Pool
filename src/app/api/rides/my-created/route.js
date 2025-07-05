import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import { authMiddleware } from '@/middleware/auth';
import { NextResponse } from 'next/server';

async function handler(req, user) {
  try {
    await connectDB();

    if (req.method !== 'GET') {
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    if (!user?.id) {
      console.error('❌ User is missing in handler');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const rides = await Ride.find({ creator: user.id })
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ rides }, { status: 200 });
  } catch (err) {
    console.error('❌ API Crash in /my-created:', err); // <- this is critical
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);
