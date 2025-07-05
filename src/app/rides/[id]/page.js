"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RideDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`/api/rides/${id}`);
        const data = await res.json();
        // console.log(data)
        if (!res.ok) throw new Error(data.message || "Failed to load ride");
        setRide(data.ride);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      } catch (_) {
        setUserId("");
      }
    }

    fetchRide();
  }, [id]);

  const handleJoin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch("/api/rides/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join ride");
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleLeave = async () => {
  const token = localStorage.getItem('token');
  if (!token) return router.push('/login');

  try {
    const res = await fetch('/api/rides/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rideId: id }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to leave ride');
    router.refresh();
  } catch (err) {
    setError(err.message);
  }
};


  if (loading) {
    return <p className="text-center text-gray-600 mt-8">Loading ride...</p>;
  }

  if (error || !ride) {
    return (
      <div className="text-center text-red-600 mt-8">
        <p>🚫 {error || "Ride not found"}</p>
      </div>
    );
  }

  const isCreator = userId === ride.creator._id;
  const alreadyJoined = ride.joiners?.some((j) => j._id === userId);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {ride.source.name} → {ride.destination.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{ride.tags[0]}</Badge>
            <Badge variant="outline">₹{ride.cost}</Badge>
            <Badge variant="outline">{ride.status}</Badge>
          </div>

          <p className="text-gray-700">{ride.description}</p>

          {ride.noteForJoiners && (
            <div className="bg-blue-50 p-3 rounded-md text-sm border">
              <strong>Note from Creator:</strong> {ride.noteForJoiners}
            </div>
          )}

          <p className="text-sm text-gray-600">
            Posted by: <strong>{ride.creator.name}</strong> (
            {ride.creator.email})
          </p>

          {isCreator && (
            <p className="text-blue-600 font-semibold">
              🎯 You are the creator of this ride
            </p>
          )}

          {!isCreator && alreadyJoined && (
            <p className="text-green-600 font-medium">
              ✅ You have already joined this ride
            </p>
          )}

          {!isCreator && (
            <>
              {alreadyJoined ? (
                <Button variant="destructive" onClick={handleLeave}>
                  Leave Ride
                </Button>
              ) : (
                <Button onClick={handleJoin}>Join Ride</Button>
              )}
            </>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
