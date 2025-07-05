import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import User from '@/models/User'; // Required for .populate
import { authMiddleware } from '@/middleware/auth';
import { NextResponse } from 'next/server';

async function handler(req) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  await connectDB();
  const userId = req.user.id;

  const rides = await Ride.find({ members: userId })
    .populate('creator', 'name email') // so you can show who created it
    .sort({ createdAt: -1 });

  return NextResponse.json({ rides });
}

export const GET = authMiddleware(handler);
