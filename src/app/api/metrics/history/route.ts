// src/app/api/metrics/history/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import pool from '@/lib/pg';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get('siteId');

  if (!siteId) {
    return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
  }

  try {
    // Add a check to ensure the user owns the site they are querying for
    const siteCheck = await pool.query(
      'SELECT id FROM next_auth.sites WHERE id = $1 AND user_id = $2',
      [siteId, session.user.id]
    );
    if (siteCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await pool.query(
      'SELECT * FROM next_auth.metrics WHERE site_id = $1 ORDER BY date DESC',
      [siteId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching metrics history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
