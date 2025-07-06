'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Plane, Umbrella, Map, Users, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <section className="py-16 text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-700">
          Welcome to PoolMate
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Discover, create, and join rides effortlessly. Save money, reduce carbon footprint, and
          connect with people going your way.
        </p>
        <div className="mt-6">
          <Link href="/available">
            <Button size="lg" className="text-base px-8">
              Find a Ride
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-4 py-10 bg-white border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">How PoolMate Works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 space-y-4 text-center">
              <Map className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="font-semibold text-lg">Find Nearby Rides</h3>
              <p className="text-sm text-muted-foreground">
                Enter your origin & destination and get a list of rides near you.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 space-y-4 text-center">
              <Users className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="font-semibold text-lg">Join or Create Rides</h3>
              <p className="text-sm text-muted-foreground">
                Join an existing ride or create one. Set your preferences, cost, and schedule.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 space-y-4 text-center">
              <Send className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="font-semibold text-lg">Reach Together</h3>
              <p className="text-sm text-muted-foreground">
                Coordinate with fellow riders, share costs, and arrive comfortably.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-16 bg-slate-50 border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">Where Can You Use PoolMate?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          <div>
            <Image
              src="/images/work.png"
              alt="Office Commute"
              width={300}
              height={200}
              className="rounded-xl mx-auto shadow-md"
            />
            <Briefcase className="mx-auto mt-4 text-blue-500" />
            <h4 className="font-semibold mt-2">Daily Office Commute</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Share rides with colleagues or nearby professionals to save on fuel and stress.
            </p>
          </div>
          <div>
            <Image
              src="/images/airport.webp"
              alt="Airport Transfer"
              width={300}
              height={200}
              className="rounded-xl mx-auto shadow-md"
            />
            <Plane className="mx-auto mt-4 text-blue-500" />
            <h4 className="font-semibold mt-2">Airport Transfers</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Heading to or from the airport? Split the ride with travelers on similar schedules.
            </p>
          </div>
          <div>
            <Image
              src="/images/vacation.png"
              alt="Vacation Ride"
              width={300}
              height={200}
              className="rounded-xl mx-auto shadow-md"
            />
            <Umbrella className="mx-auto mt-4 text-blue-500" />
            <h4 className="font-semibold mt-2">Fun Weekend Trips</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Traveling to a hill station or beach? Team up with others going your way.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center py-12 bg-blue-50 border-t mt-8">
        <h2 className="text-2xl font-bold text-blue-700">Ready to Ride Smarter?</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Sign up and start pooling today. It’s simple, eco-friendly, and convenient.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/available">
            <Button size="lg" variant="default">
              Get Started
            </Button>
          </Link>
          <Link href="/create-ride">
            <Button size="lg" variant="outline">
              Create a Ride
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
