import { connectDB } from "@/lib/db";
import Ride from "@/models/Ride";
import { authMiddleware } from "@/middleware/auth";
import { NextResponse } from "next/server";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

async function handler(req, user) {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  await connectDB();

  const { rideId, updates } = await req.json();
  const userId = user.id;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  if (ride.creator.toString() !== userId) {
    return NextResponse.json(
      { message: "Only the ride creator can edit this ride" },
      { status: 403 }
    );
  }

  // Re-geocode if source/destination names are updated
  if (updates.source?.name) {
    const geo = await geocoder
      .forwardGeocode({ query: updates.source.name, limit: 1 })
      .send();
    updates.source.coordinates =
      geo.body.features[0]?.geometry?.coordinates || ride.source.coordinates;
  }

  if (updates.destination?.name) {
    const geo = await geocoder
      .forwardGeocode({ query: updates.destination.name, limit: 1 })
      .send();
    updates.destination.coordinates =
      geo.body.features[0]?.geometry?.coordinates ||
      ride.destination.coordinates;
  }
  if (updates.rideDate) {
    const dateObj = new Date(updates.rideDate);
    if (!isNaN(dateObj)) {
      updates.rideDate = dateObj;
    } else {
      delete updates.rideDate; // prevent invalid dates from breaking
    }
  }

  // Perform the update
  await Ride.findByIdAndUpdate(rideId, updates, {
    new: true,
    runValidators: true,
  });

  return NextResponse.json(
    { message: "Ride updated successfully" },
    { status: 200 }
  );
}

export const PATCH = authMiddleware(handler);
