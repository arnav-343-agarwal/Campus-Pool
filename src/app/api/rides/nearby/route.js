import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));
  const distance = parseInt(searchParams.get('distance')) || 10000; // default 10km

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ message: 'Latitude and longitude required' }, { status: 400 });
  }

  try {
    const rides = await Ride.find({
      'source.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: distance,
        },
      },
    }).populate('creator', 'name email');

    return NextResponse.json({ rides });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch nearby rides' }, { status: 500 });
  }
}
