import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', { httpOnly: true, maxAge: -1 });
  return response;
}
