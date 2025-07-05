'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyJoinedRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMyJoined = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      try {
        const res = await fetch('/api/rides/my-joined', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load rides');
        setRides(data.rides || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMyJoined();
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">My Joined Rides</h1>

      {error && <p className="text-red-600">{error}</p>}

      {rides.length === 0 ? (
        <p className="text-gray-600">No joined rides yet.</p>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride._id} className="border rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {ride.source.name} → {ride.destination.name}
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                ₹{ride.cost} | {ride.status} | {ride.tag}
              </p>
              <p className="mt-1 text-gray-700">{ride.description}</p>
              <Link
                href={`/rides/${ride._id}`}
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
