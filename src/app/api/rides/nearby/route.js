import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));

  if (!lat || !lng) {
    return NextResponse.json({ message: 'Latitude and longitude required' }, { status: 400 });
  }

  const rides = await Ride.find({
    'source.coordinates': {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: 300000 // in meters (10 km)
      }
    }
  }).populate('creator', 'name email');

  return NextResponse.json({ rides });
}
