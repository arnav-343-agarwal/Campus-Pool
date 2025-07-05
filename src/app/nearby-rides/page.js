'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NearbyRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`/api/rides/nearby?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to fetch nearby rides');
          setRides(data.rides || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Permission denied or location error');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Rides</h1>

      {loading && <p className="text-gray-500">Loading your location...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && rides.length === 0 && (
        <p className="text-gray-500">No nearby rides found.</p>
      )}

      <div className="space-y-4">
        {rides.map((ride) => (
          <div key={ride._id} className="p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold">
              {ride.source.name} → {ride.destination.name}
            </h2>
            <p className="text-sm text-gray-600">
              {ride.tags.join(', ')} | ₹{ride.cost} | Status: {ride.status}
            </p>
            <p className="mt-1 text-gray-700">{ride.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Posted by: {ride.creator?.name} ({ride.creator?.email})
            </p>
            <Link
              href={`/rides/${ride._id}`}
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
