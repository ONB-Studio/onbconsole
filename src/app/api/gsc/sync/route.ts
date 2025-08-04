// src/app/api/gsc/sync/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { syncGSC } from '@/lib/gscSync';
import pool from '@/lib/pg';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { siteUrl, siteId } = await req.json();
  const userId = session.user.id;

  try {
    const tokenQuery = await pool.query(
      `SELECT access_token FROM next_auth.accounts WHERE "userId" = $1 AND provider = 'google'`,
      [userId]
    );
    const accessToken = tokenQuery.rows[0]?.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: 'Google access token not found.' }, { status: 403 });
    }

    const result = await syncGSC(accessToken, siteUrl, siteId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error in gsc/sync:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
