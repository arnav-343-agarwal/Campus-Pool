"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function CreateRidePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    sourceText: "",
    destinationText: "",
    tags: "",
    description: "",
    noteForJoiners: "",
    cost: "",
    maxMembers: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create ride");

      router.push("/my-created-rides");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-center">Create a Ride</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>From (text address)</Label>
            <Input
              name="sourceText"
              required
              value={form.sourceText}
              onChange={handleChange}
            />

            <Label>To (text address)</Label>
            <Input
              name="destinationText"
              required
              value={form.destinationText}
              onChange={handleChange}
            />

            <Label>Tag(s) — comma separated</Label>
            <Input name="tags" value={form.tags} onChange={handleChange} />

            <Label>Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            <Label>Note for Joiners</Label>
            <Textarea
              name="noteForJoiners"
              value={form.noteForJoiners}
              onChange={handleChange}
            />

            <Label>Total Cost (₹)</Label>
            <Input
              name="cost"
              type="number"
              value={form.cost}
              onChange={handleChange}
            />

            <Label>Max Members</Label>
            <Input
              name="maxMembers"
              type="number"
              value={form.maxMembers}
              onChange={handleChange}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full">
              Create Ride
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
