import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { authMiddleware } from '@/middleware/auth';
import { NextResponse } from 'next/server';

async function handler(req, user) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  await connectDB();

  const { rideId } = await req.json();
  const userId = user.id;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
  }

  if (ride.creator.toString() === userId) {
    return NextResponse.json({ message: 'You cannot join your own ride' }, { status: 400 });
  }

  if (ride.members.includes(userId)) {
    return NextResponse.json({ message: 'Already joined this ride' }, { status: 400 });
  }

  if (ride.members.length >= ride.maxMembers) {
    return NextResponse.json({ message: 'Ride is already full' }, { status: 400 });
  }

  // 1. Add member to the ride
  ride.members.push(userId);

  // 2. Recalculate status
  const currentCount = ride.members.length;
  if (currentCount === ride.maxMembers) {
    ride.status = 'Full';
  } else if (currentCount === ride.maxMembers - 1) {
    ride.status = 'Filling Fast';
  } else {
    ride.status = 'Available';
  }

  await ride.save();

  // 3. Add ride to user's joinedRides
  await User.findByIdAndUpdate(userId, {
    $addToSet: { joinedRides: rideId }
  });

  return NextResponse.json({ message: 'Successfully joined the ride' }, { status: 200 });
}

export const POST = authMiddleware(handler);
