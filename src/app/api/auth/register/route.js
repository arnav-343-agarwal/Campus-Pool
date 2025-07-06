import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { name, email, password, phone } = await req.json();

  if (!phone || phone.length !== 10) {
    return NextResponse.json(
      { message: "Phone must be 10 digits" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    email,
    phone,
    passwordHash,
  });

  return NextResponse.json(
    { message: "User registered", userId: newUser._id },
    { status: 201 }
  );
}
