'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function RideDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`/api/rides/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load ride');
        setRide(data.ride || null);
      } catch (err) {
        setError(err.message);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
    }

    fetchRide();
  }, [id]);

  const handleJoin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/rides/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to join ride');

      router.refresh(); // reload to reflect changes
    } catch (err) {
      setError(err.message);
    }
  };

  if (!ride) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-xl font-semibold">Loading...</h1>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  const isCreator = userId === ride.creator._id;
  const alreadyJoined = ride.joiners?.some(j => j._id === userId);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">{ride.source.name} → {ride.destination.name}</h1>
      <p className="text-gray-600 text-sm">{ride.tag} | ₹{ride.cost} | Status: {ride.status}</p>
      <p className="text-gray-700">{ride.description}</p>
      {ride.note && (
        <p className="text-sm mt-2 p-2 border rounded-md bg-gray-50">
          <strong>Note from Creator:</strong> {ride.note}
        </p>
      )}
      <p className="text-sm text-gray-500">Posted by: {ride.creator.name} ({ride.creator.email})</p>

      {!isCreator && !alreadyJoined && (
        <Button onClick={handleJoin}>Join Ride</Button>
      )}

      {alreadyJoined && (
        <p className="text-green-600 font-medium">You have already joined this ride ✅</p>
      )}

      {isCreator && (
        <p className="text-blue-600 font-medium">You are the creator of this ride 🎯</p>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
