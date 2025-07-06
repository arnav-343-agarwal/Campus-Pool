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

  // Move fetchRide outside to reuse it
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

  useEffect(() => {
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

      await fetchRide(); // ✅ re-fetch ride data
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

      await fetchRide(); // ✅ re-fetch ride data
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
        body: JSON.stringify({ rideId: id, userIdToRemove }),
      });

      await fetchRide(); // ✅ re-fetch after removal
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
          {/* Basic Info Section */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Price:</span>
              <span>₹{ride.cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span>{ride.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Seats:</span>
              <span>
                {ride.members?.length || 0} / {ride.maxMembers} filled
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Ride Date & Time:</span>
              <span className="text-blue-700 font-medium">
                {new Date(ride.rideDate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            {ride.tags?.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="font-semibold">Tags:</span>
                <span className="flex gap-2 flex-wrap justify-end max-w-[70%]">
                  {ride.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Description & Note */}
          <p className="text-gray-700 text-sm">{ride.description}</p>

          {ride.noteForJoiners && (
            <div className="bg-blue-50 p-3 rounded-md text-sm border">
              <strong>Note:</strong> {ride.noteForJoiners}
            </div>
          )}

          <p className="text-sm text-gray-500">
            Posted by: <strong>{ride.creator.name}</strong> (
            {ride.creator.email})<br />
            📞 <strong>{ride.creator.phone}</strong>
          </p>

          {/* Action Buttons */}
          {isCreator && (
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/edit-ride/${ride._id}`)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDeleteRide}>
                Delete
              </Button>
            </div>
          )}

          {!isCreator && alreadyJoined && (
            <Button variant="destructive" onClick={handleLeave}>
              Leave Ride
            </Button>
          )}

          {!isCreator && !alreadyJoined && (
            <Button onClick={handleJoin}>Join Ride</Button>
          )}

          {/* Member List */}
          {ride.members?.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-lg">Members Joined</h3>
              <ul className="text-sm space-y-1">
                {ride.members.map((user) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center border-b pb-1"
                  >
                    <span>
                      {user.name} ({user.email})
                    </span>
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
