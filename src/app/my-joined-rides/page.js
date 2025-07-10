"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarCheck, Route } from "lucide-react";

export default function MyJoinedRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalJoined: 0,
    upcomingDate: null,
    totalMembers: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchMyJoined = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch("/api/rides/my-joined", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load rides");

        setRides(data.rides || []);

        // 👉 Calculate Stats
        const joinedCount = data.rides.length;
        const upcomingRide = data.rides
          .filter((r) => new Date(r.rideDate) > new Date())
          .sort((a, b) => new Date(a.rideDate) - new Date(b.rideDate))[0];
        const totalMembers = data.rides.reduce(
          (acc, ride) => acc + (ride.members?.length || 0) - 1,
          0
        );

        setStats({
          totalJoined: joinedCount,
          upcomingDate: upcomingRide?.rideDate || null,
          totalMembers: totalMembers < 0 ? 0 : totalMembers,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMyJoined();
  }, [router]);

  const getStatusBadge = (status) => {
    const colorMap = {
      Available: "bg-green-100 text-green-700 border-green-300",
      "Filling Fast": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Full: "bg-red-100 text-red-700 border-red-300",
    };
    return (
      <Badge
        className={`border ${
          colorMap[status] || "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold">My Joined Rides</h1>

      {/* 🚀 STATS PANEL START */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white">
          <Route className="text-blue-600 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-500">Rides Joined</p>
            <p className="text-xl font-bold">{stats.totalJoined}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white">
          <CalendarCheck className="text-green-600 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-500">Next Ride</p>
            <p className="text-base font-semibold text-gray-700">
              {stats.upcomingDate
                ? new Date(stats.upcomingDate).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "No upcoming"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white">
          <Users className="text-purple-600 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-500">Total Co-members</p>
            <p className="text-xl font-bold">{stats.totalMembers}</p>
          </div>
        </div>
      </div>
      {/* STATS PANEL END */}

      {error && <p className="text-red-600">{error}</p>}

      {rides.length === 0 ? (
        <p className="text-gray-600">You have not joined any rides yet.</p>
      ) : (
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
                {/* {getStatusBadge(ride.status)} */}
              </div>

              <p className="text-sm text-gray-600">
                <strong>Tags:</strong> {ride.tags?.join(", ") || "None"} &nbsp;
                | &nbsp;
                <strong>Cost:</strong> ₹{ride.cost}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <strong>Ride Time:</strong>{" "}
                <span className="text-blue-700 font-medium">
                  {new Date(ride.rideDate).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </p>

              <p className="mt-2 text-gray-700">{ride.description}</p>

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
      )}
    </div>
  );
}
