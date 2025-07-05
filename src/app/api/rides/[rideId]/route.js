import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectDB();

  const rideId = params.rideId;

  const ride = await Ride.findById(rideId)
    .populate('creator', 'name email')
    .populate('members', 'name email');

  if (!ride) {
    return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
  }

  return NextResponse.json({ ride }, { status: 200 });
}
