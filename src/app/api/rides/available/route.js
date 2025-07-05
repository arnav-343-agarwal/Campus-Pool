import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  const rides = await Ride.find()
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });

  return NextResponse.json({ rides }, { status: 200 });
}
