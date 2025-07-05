import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(handler) {
  return async (req, ...args) => {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Pass user as second param
      return handler(req, decoded, ...args);
    } catch (err) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  };
}
