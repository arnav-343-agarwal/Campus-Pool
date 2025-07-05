'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function EditRidePage() {
  const { rideId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    from: '',
    to: '',
    tags: '',
    description: '',
    noteForJoiners: '',
    cost: '',
    maxMembers: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`/api/rides/${rideId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch ride');

        setForm({
          from: data.ride.source.name,
          to: data.ride.destination.name,
          tags: data.ride.tags.join(', '),
          description: data.ride.description,
          noteForJoiners: data.ride.noteForJoiners,
          cost: data.ride.cost,
          maxMembers: data.ride.maxMembers,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError('');

    const updates = {
      source: { name: form.from },
      destination: { name: form.to },
      tags: form.tags.split(',').map((tag) => tag.trim()),
      description: form.description,
      noteForJoiners: form.noteForJoiners,
      cost: parseInt(form.cost),
      maxMembers: parseInt(form.maxMembers),
    };

    try {
      const res = await fetch('/api/rides/edit', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId, updates }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      router.push('/my-created-rides');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center py-10">Loading ride info...</p>;

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-center">Edit Ride</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>From</Label>
              <Input name="from" value={form.from} onChange={handleChange} required />
            </div>
            <div>
              <Label>To</Label>
              <Input name="to" value={form.to} onChange={handleChange} required />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input name="tags" value={form.tags} onChange={handleChange} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div>
              <Label>Note for Joiners</Label>
              <Textarea name="noteForJoiners" value={form.noteForJoiners} onChange={handleChange} />
            </div>
            <div>
              <Label>Cost (₹)</Label>
              <Input type="number" name="cost" value={form.cost} onChange={handleChange} required />
            </div>
            <div>
              <Label>Max Members</Label>
              <Input type="number" name="maxMembers" value={form.maxMembers} onChange={handleChange} required />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Update Ride</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
