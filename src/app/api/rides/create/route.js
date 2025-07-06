import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { authMiddleware } from '@/middleware/auth';
import { NextResponse } from 'next/server';
import { getCoordinates } from '@/lib/geocode';

async function handler(req, decodedUser) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  await connectDB();
  const body = await req.json();
  const {
    sourceText,
    destinationText,
    tags,
    rideDate, // ✅ NEW
    description,
    noteForJoiners,
    cost,
    maxMembers,
  } = body;

  const creatorId = decodedUser.id;

  try {
    if (!rideDate || isNaN(new Date(rideDate))) {
      return NextResponse.json({ message: 'Invalid or missing ride date' }, { status: 400 });
    }

    const source = await getCoordinates(sourceText);
    const destination = await getCoordinates(destinationText);

    const newRide = await Ride.create({
      creator: creatorId,
      source,
      destination,
      tags: [tags], // wrapped in array since schema expects array
      rideDate: new Date(rideDate),
      description,
      noteForJoiners,
      cost,
      maxMembers
    });

    await User.findByIdAndUpdate(creatorId, {
      $push: { createdRides: newRide._id }
    });

    return NextResponse.json({ message: 'Ride created', ride: newRide }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to create ride', error: err.message }, { status: 400 });
  }
}

export const POST = authMiddleware(handler);
