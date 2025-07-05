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

  const isCreator = userId === ride?.creator._id;
  const alreadyJoined = ride?.members?.some((m) => m._id === userId);

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
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch("/api/rides/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to leave ride");
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userIdToRemove) => {
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/rides/remove-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: id, userId: userIdToRemove }),
      });
      router.refresh();
    } catch (err) {
      alert("Failed to remove member");
    }
  };

  const handleDeleteRide = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/rides/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: id }),
      });
      router.push("/my-created-rides");
    } catch (err) {
      alert("Failed to delete ride");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-8">Loading ride...</p>;
  if (error || !ride)
    return (
      <div className="text-center text-red-600 mt-8">
        🚫 {error || "Ride not found"}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {ride.source.name} → {ride.destination.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {ride.tags?.map((tag, i) => (
              <Badge key={i} variant="outline">{tag}</Badge>
            ))}
            <Badge variant="outline">₹{ride.cost}</Badge>
            <Badge variant="outline">{ride.status}</Badge>
          </div>

          <p className="text-gray-700">{ride.description}</p>

          {ride.noteForJoiners && (
            <div className="bg-blue-50 p-3 rounded-md text-sm border">
              <strong>Note:</strong> {ride.noteForJoiners}
            </div>
          )}

          <p className="text-sm text-gray-500">
            Posted by: <strong>{ride.creator.name}</strong> ({ride.creator.email})
          </p>

          {isCreator && (
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/edit-ride/${ride._id}`)}>Edit</Button>
              <Button variant="destructive" onClick={handleDeleteRide}>Delete</Button>
            </div>
          )}

          {!isCreator && alreadyJoined && (
            <Button variant="destructive" onClick={handleLeave}>Leave Ride</Button>
          )}

          {!isCreator && !alreadyJoined && (
            <Button onClick={handleJoin}>Join Ride</Button>
          )}

          {ride.members?.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-lg">Members Joined</h3>
              <ul className="text-sm space-y-1">
                {ride.members.map((user) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center border-b pb-1"
                  >
                    <span>{user.name} ({user.email})</span>
                    {isCreator && user._id !== userId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => handleRemoveMember(user._id)}
                      >
                        Remove
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
