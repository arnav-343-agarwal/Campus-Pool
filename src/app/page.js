'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Plane, Umbrella, Map, Users, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* HERO */}
      <section className="py-16 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight text-blue-700"
        >
          Welcome to PoolMate
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto"
        >
          Discover, create, and join rides effortlessly. Save money, reduce carbon footprint, and
          connect with people going your way.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="mt-6 inline-block"
        >
          <Link href="/available">
            <Button size="lg" className="text-base px-8 shadow-md">
              Find a Ride
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-10 bg-white border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">How PoolMate Works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[{
            icon: <Map className="mx-auto h-10 w-10 text-blue-600" />,
            title: "Find Nearby Rides",
            desc: "Enter your origin & destination and get a list of rides near you.",
          },
          {
            icon: <Users className="mx-auto h-10 w-10 text-blue-600" />,
            title: "Join or Create Rides",
            desc: "Join an existing ride or create one. Set your preferences, cost, and schedule.",
          },
          {
            icon: <Send className="mx-auto h-10 w-10 text-blue-600" />,
            title: "Reach Together",
            desc: "Coordinate with fellow riders, share costs, and arrive comfortably.",
          }].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, boxShadow: '0px 12px 24px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Card className="transition-all bg-white rounded-lg shadow-sm">
                <CardContent className="p-6 space-y-4 text-center">
                  {item.icon}
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHERE TO USE */}
      <section className="px-4 py-16 bg-slate-50 border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">Where Can You Use PoolMate?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {[
            {
              src: "/images/work.png",
              icon: <Briefcase className="mx-auto mt-4 text-blue-500" />,
              title: "Daily Office Commute",
              desc: "Share rides with colleagues or nearby professionals to save on fuel and stress.",
            },
            {
              src: "/images/airport.webp",
              icon: <Plane className="mx-auto mt-4 text-blue-500" />,
              title: "Airport Transfers",
              desc: "Heading to or from the airport? Split the ride with travelers on similar schedules.",
            },
            {
              src: "/images/vacation.png",
              icon: <Umbrella className="mx-auto mt-4 text-blue-500" />,
              title: "Fun Weekend Trips",
              desc: "Traveling to a hill station or beach? Team up with others going your way.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="group"
            >
              <div className="overflow-hidden rounded-xl shadow-md">
                <Image
                  src={item.src}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="mx-auto rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {item.icon}
              <h4 className="font-semibold mt-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-12 bg-blue-50 border-t mt-8">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-blue-700"
        >
          Ready to Ride Smarter?
        </motion.h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Sign up and start pooling today. It’s simple, eco-friendly, and convenient.
        </p>
        <div className="flex justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link href="/available">
              <Button size="lg">Get Started</Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link href="/create-ride">
              <Button size="lg" variant="outline">
                Create a Ride
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
