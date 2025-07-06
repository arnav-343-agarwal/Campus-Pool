'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AvailableRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch('/api/rides/available');
        const data = await res.json();
        // console.log(data)
        if (!res.ok) throw new Error(data.message || 'Failed to load rides');
        setRides(data.rides || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchRides();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Available Rides</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {rides.length === 0 && <p className="text-gray-500">No rides found.</p>}

        {rides.map((ride) => (
          <div key={ride._id} className="p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold">
              {ride.source.name} → {ride.destination.name}
            </h2>
            <p className="text-sm text-gray-600">{ride.tags[0]} | ₹{ride.cost} | Status: {ride.status}</p>
            <p className="mt-1 text-gray-700">{ride.description}</p>
            <Link href={`/rides/${ride._id}`} className="text-blue-600 text-sm mt-2 inline-block">View Details →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
