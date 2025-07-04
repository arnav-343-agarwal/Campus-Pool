import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { authMiddleware } from '@/middleware/auth';
import { NextResponse } from 'next/server';

async function handler(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  await connectDB();

  const { rideId } = await req.json();
  const userId = req.user.id;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
  }

  // ✅ Prevent user from joining their own ride
  if (ride.creator.toString() === userId) {
    return NextResponse.json({ message: 'You cannot join your own ride' }, { status: 400 });
  }

  // ✅ Prevent duplicate join
  if (ride.members.includes(userId)) {
    return NextResponse.json({ message: 'Already joined this ride' }, { status: 400 });
  }

  // ✅ Prevent overbooking
  if (ride.members.length >= ride.maxMembers) {
    return NextResponse.json({ message: 'Ride is already full' }, { status: 400 });
  }

  // ✅ Push to both Ride and User docs
  await Ride.findByIdAndUpdate(rideId, {
    $push: { members: userId }
  });

  await User.findByIdAndUpdate(userId, {
    $push: { joinedRides: rideId }
  });

  return NextResponse.json({ message: 'Successfully joined the ride' }, { status: 200 });
}

export const POST = authMiddleware(handler);
