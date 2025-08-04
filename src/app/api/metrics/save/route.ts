// src/app/api/metrics/save/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import pool from '@/lib/pg';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { site_id, date, clicks, impressions, ctr, position } = await req.json();

    // 필수 데이터 검증
    if (!site_id || !date) {
      return NextResponse.json({ error: 'site_id and date are required' }, { status: 400 });
    }
    
    // 요청한 사용자가 해당 사이트의 소유자인지 확인 (보안)
    const siteCheck = await pool.query(
      'SELECT id FROM next_auth.sites WHERE id = $1 AND user_id = $2',
      [site_id, session.user.id]
    );
    if (siteCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 데이터베이스에 지표 삽입
    const result = await pool.query(
      `INSERT INTO next_auth.metrics (site_id, date, clicks, impressions, ctr, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [site_id, date, clicks, impressions, ctr, position]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error saving metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
