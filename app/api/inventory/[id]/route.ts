import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

async function getUserIdFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { name, quantity, description } = await request.json();

    const { rows } = await db.query(
      'UPDATE inventory_items SET name = $1, quantity = $2, description = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, quantity, description, id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Item with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const { rows } = await db.query(
      'DELETE FROM inventory_items WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
