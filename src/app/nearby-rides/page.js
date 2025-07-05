'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // if you're using shadcn/ui or your own button

export default function NearbyRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [distanceKm, setDistanceKm] = useState(50); // default: 50 km
  const [coords, setCoords] = useState(null);

  const fetchRides = async (lat, lng, km) => {
    if (km <= 0 || isNaN(km)) {
      setError('Please enter a valid distance greater than 0.');
      return;
    }
    const meters = km * 1000;

    try {
      setLoading(true);
      const res = await fetch(`/api/rides/nearby?lat=${lat}&lng=${lng}&distance=${meters}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch nearby rides');
      setRides(data.rides || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        fetchRides(latitude, longitude, distanceKm);
      },
      () => {
        setError('Permission denied or location error');
        setLoading(false);
      }
    );
  }, []);

  const handleSearch = () => {
    if (coords) fetchRides(coords.latitude, coords.longitude, distanceKm);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Rides</h1>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Search Radius (in kilometers)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseInt(e.target.value) || '')}
            className="border p-2 rounded-md w-40"
            placeholder="Enter distance"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading rides...</p>}
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
