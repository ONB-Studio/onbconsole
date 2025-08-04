// src/app/api/sites/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import pool from '@/lib/pg';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM next_auth.sites WHERE user_id = $1 ORDER BY created_at DESC',
      [session.user.id]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { siteUrl } = await req.json();
    if (!siteUrl) {
      return NextResponse.json({ error: 'Site URL is required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO next_auth.sites (user_id, site_url) VALUES ($1, $2) RETURNING *',
      [session.user.id, siteUrl]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
