import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import { authMiddleware } from '@/middleware/auth';
import { NextResponse } from 'next/server';

async function handler(req, user) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  await connectDB();

  const { rideId, userIdToRemove } = await req.json();
  const requesterId = user.id; // ✅ Use second param `user`

  const ride = await Ride.findById(rideId);

  if (!ride) {
    return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
  }

  if (ride.creator.toString() !== requesterId) {
    return NextResponse.json({ message: 'Only the creator can remove members' }, { status: 403 });
  }

  // Remove user from ride
  await Ride.findByIdAndUpdate(rideId, {
    $pull: { members: userIdToRemove }
  });

  return NextResponse.json({ message: 'Member removed successfully' }, { status: 200 });
}

export const POST = authMiddleware(handler);
