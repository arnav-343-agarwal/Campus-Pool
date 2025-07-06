'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NearbyRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [distanceKm, setDistanceKm] = useState(50);
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

  const getStatusBadge = (status) => {
    const colorMap = {
      Available: 'bg-green-100 text-green-700 border-green-300',
      'Filling Fast': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Full: 'bg-red-100 text-red-700 border-red-300',
    };
    return (
      <Badge className={`border ${colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Nearby Rides</h1>

      <div className="bg-gray-50 p-4 rounded-md border w-full max-w-md">
        <Label htmlFor="distance" className="text-sm font-medium">
          Search Radius (in kilometers)
        </Label>
        <div className="flex items-center gap-3 mt-2">
          <Input
            id="distance"
            type="number"
            min="1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseInt(e.target.value) || '')}
            placeholder="Enter distance"
            className="w-36"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {loading && <p className="text-gray-500">🔄 Loading nearby rides...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && rides.length === 0 && (
        <p className="text-gray-500">No nearby rides found within {distanceKm} km.</p>
      )}

      <div className="space-y-4">
        {rides.map((ride) => (
          <div
            key={ride._id}
            className="p-5 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                {ride.source.name} → {ride.destination.name}
              </h2>
              {getStatusBadge(ride.status)}
            </div>

            <p className="text-sm text-gray-600">
              <strong>Tags:</strong> {ride.tags?.join(', ') || 'None'} &nbsp; | &nbsp;
              <strong>Cost:</strong> ₹{ride.cost}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              <strong>Ride Time:</strong>{' '}
              <span className="text-blue-700 font-medium">
                {new Date(ride.rideDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </p>

            <p className="mt-2 text-gray-700">{ride.description}</p>

            <p className="text-sm text-gray-500 mt-1">
              Posted by: {ride.creator?.name} ({ride.creator?.email})
            </p>

            <div className="mt-4">
              <Link href={`/rides/${ride._id}`}>
                <Button size="sm" variant="outline">
                  View Details →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
