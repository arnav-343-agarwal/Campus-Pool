'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allTags = ['Work', 'Airport', 'Vacation', 'Weekend', 'College'];
const allStatuses = ['Available', 'Filling Fast', 'Full'];

export default function AvailableRidesPage() {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [error, setError] = useState('');

  // Filters
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch('/api/rides/available');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load rides');
        setRides(data.rides || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchRides();
  }, []);

  useEffect(() => {
    let filtered = [...rides];

    // Tag Filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((ride) =>
        ride.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    // Status Filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((ride) => selectedStatuses.includes(ride.status));
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.rideDate).getTime();
      const dateB = new Date(b.rideDate).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredRides(filtered);
  }, [selectedTags, selectedStatuses, sortBy, rides]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const getStatusBadge = (status) => {
    const styleMap = {
      Available: 'bg-green-100 text-green-700 border-green-300',
      'Filling Fast': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Full: 'bg-red-100 text-red-700 border-red-300',
    };

    return (
      <Badge className={`border ${styleMap[status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <aside className="md:col-span-1 space-y-6">
        <Card className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-semibold">Sort by</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold">Tags</Label>
            <div className="space-y-2 mt-2">
              {allTags.map((tag) => (
                <div key={tag} className="flex items-center gap-2">
                  <Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                  <span className="text-sm">{tag}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Status</Label>
            <div className="space-y-2 mt-2">
              {allStatuses.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox checked={selectedStatuses.includes(status)} onCheckedChange={() => toggleStatus(status)} />
                  <span className="text-sm">{status}</span>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full" onClick={() => {
            setSelectedTags([]);
            setSelectedStatuses([]);
            setSortBy('newest');
          }}>
            Reset Filters
          </Button>
        </Card>
      </aside>

      {/* Ride Cards */}
      <section className="md:col-span-3 space-y-5">
        <h1 className="text-2xl font-bold">Available Rides</h1>

        {error && <p className="text-red-600">{error}</p>}
        {filteredRides.length === 0 && <p className="text-gray-500">No rides found.</p>}

        {filteredRides.map((ride) => (
          <div key={ride._id} className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
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

            <p className="mt-2 text-gray-700 line-clamp-3">{ride.description}</p>

            <div className="mt-4">
              <Link href={`/rides/${ride._id}`}>
                <Button size="sm" variant="outline">
                  View Details →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
