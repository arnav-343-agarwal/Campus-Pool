'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

export default function CreateRidePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    sourceText: '',
    destinationText: '',
    tags: '',
    rideDate: '',
    description: '',
    noteForJoiners: '',
    cost: '',
    maxMembers: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/rides/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create ride');
      router.push('/my-created-rides');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-50 px-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-blue-700">
          Create a New Ride
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From and To */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sourceText">From (text address)</Label>
                <Input
                  id="sourceText"
                  name="sourceText"
                  required
                  placeholder="e.g. Chennai Central"
                  value={form.sourceText}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="destinationText">To (text address)</Label>
                <Input
                  id="destinationText"
                  name="destinationText"
                  required
                  placeholder="e.g. Airport Terminal 1"
                  value={form.destinationText}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date + Tags */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rideDate">Ride Date & Time</Label>
                <Input
                  id="rideDate"
                  name="rideDate"
                  type="datetime-local"
                  required
                  value={form.rideDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="tags">Purpose / Tag</Label>
                <select
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm"
                  required
                >
                  <option value="">Select a tag</option>
                  <option value="Vacation">🌴 Vacation</option>
                  <option value="Work">💼 Work</option>
                  <option value="Exams">📚 Exams</option>
                  <option value="Airport">✈️ Airport</option>
                </select>
              </div>
            </div>

            {/* Description & Note */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What should people know about this ride?"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="noteForJoiners">Note for Joiners</Label>
              <Textarea
                id="noteForJoiners"
                name="noteForJoiners"
                placeholder="e.g. Please be on time, no smoking, etc."
                value={form.noteForJoiners}
                onChange={handleChange}
              />
            </div>

            {/* Cost & Max Members */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost">Total Cost (₹)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  placeholder="e.g. 300"
                  value={form.cost}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="maxMembers">Max Members</Label>
                <Input
                  id="maxMembers"
                  name="maxMembers"
                  type="number"
                  placeholder="e.g. 4"
                  value={form.maxMembers}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Error & Submit */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full text-white font-semibold text-base">
            Create Ride
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
