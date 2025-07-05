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

  // Don't allow creator to leave their own ride
  if (ride.creator.toString() === userId) {
    return NextResponse.json({ message: 'Creator cannot leave their own ride' }, { status: 400 });
  }

  if (!ride.members.includes(userId)) {
    return NextResponse.json({ message: 'You are not a member of this ride' }, { status: 400 });
  }

  // 1. Remove user from ride.members
  await Ride.findByIdAndUpdate(rideId, {
    $pull: { members: userId }
  });

  // 2. Remove ride from user.joinedRides
  await User.findByIdAndUpdate(userId, {
    $pull: { joinedRides: rideId }
  });

  return NextResponse.json({ message: 'You have left the ride successfully' }, { status: 200 });
}

export const POST = authMiddleware(handler);
