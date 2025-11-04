import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    // Check for unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
