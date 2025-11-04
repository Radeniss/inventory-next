import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch inventory items' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, quantity, description } = body;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a non-negative number' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('inventory_items')
      .insert([
        {
          name: name.trim(),
          quantity,
          description: description || '',
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      // Log error dari Supabase (termasuk error kode 23505)
      console.error('Supabase Error on Insert:', error); 
      
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Item with this name already exists' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create inventory item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    // Log error runtime tak terduga (misalnya JSON parsing error)
    console.error('Runtime Error in POST Handler:', error); 
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
