'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyCreatedRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMyRides = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      try {
        const res = await fetch('/api/rides/my-created', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // console.log(data)
        if (!res.ok) throw new Error(data.message || 'Failed to load created rides');
        setRides(data.rides || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMyRides();
  }, [router]);

  const handleDelete = async (rideId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/rides/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId }),
      });
      if (!res.ok) throw new Error('Failed to delete ride');
      setRides(prev => prev.filter(r => r._id !== rideId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">My Created Rides</h1>

      {error && <p className="text-red-600">{error}</p>}

      {rides.length === 0 ? (
        <p className="text-gray-600">No rides created yet.</p>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride._id} className="border rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{ride.source.name} → {ride.destination.name}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => router.push(`/edit-ride/${ride._id}`)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(ride._id)}>Delete</Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">₹{ride.cost} | {ride.status} | {ride.tag}</p>
              <p className="mt-1 text-gray-700">{ride.description}</p>

              {Array.isArray(ride.members) && ride.members.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold">members:</p>
                  <ul className="list-disc ml-5">
                    {ride.members.map((j) => (
                      <li key={j._id} className="text-sm flex justify-between">
                        <span>{j.name} ({j.email})</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            await fetch('/api/rides/remove-member', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ rideId: ride._id, userId: j._id }),
                            });
                            router.refresh();
                          }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
