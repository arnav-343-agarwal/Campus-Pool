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

  const { rideId, userIdToRemove } = await req.json();
  const requesterId = req.user.id;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
  }

  if (ride.creator.toString() !== requesterId) {
    return NextResponse.json({ message: 'Only the ride creator can remove members' }, { status: 403 });
  }

  if (!ride.members.includes(userIdToRemove)) {
    return NextResponse.json({ message: 'User is not a member of this ride' }, { status: 400 });
  }

  // Remove user from ride.members
  await Ride.findByIdAndUpdate(rideId, {
    $pull: { members: userIdToRemove }
  });

  // Remove ride from user.joinedRides
  await User.findByIdAndUpdate(userIdToRemove, {
    $pull: { joinedRides: rideId }
  });

  return NextResponse.json({ message: 'Member removed from ride' }, { status: 200 });
}

export const POST = authMiddleware(handler);
