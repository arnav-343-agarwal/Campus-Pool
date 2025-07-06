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
  const userId = user.id; // ✅ Correct usage

  const ride = await Ride.findById(rideId);

  if (!ride) {
    return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
  }

  if (ride.creator.toString() !== userId) {
    return NextResponse.json({ message: 'Only the ride creator can delete this ride' }, { status: 403 });
  }

  // Remove ride from joinedRides of all members
  await User.updateMany(
    { _id: { $in: ride.members } },
    { $pull: { joinedRides: rideId } }
  );

  // Remove ride from creator’s createdRides
  await User.findByIdAndUpdate(userId, {
    $pull: { createdRides: rideId }
  });

  // Delete the ride itself
  await Ride.findByIdAndDelete(rideId);

  return NextResponse.json({ message: 'Ride deleted successfully' }, { status: 200 });
}

export const POST = authMiddleware(handler);
