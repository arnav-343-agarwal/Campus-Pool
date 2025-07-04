import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  return NextResponse.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
}
