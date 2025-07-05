import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectDB();

    // const rideId = params.rideId;
    const {rideId} = await params;

    if (!rideId) {
      return NextResponse.json({ message: 'Ride ID is required' }, { status: 400 });
    }

    const ride = await Ride.findById(rideId)
      .populate('creator', 'name email')
      .populate('members', 'name email');

    if (!ride) {
      return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
    }

    return NextResponse.json({ ride }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ride:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
