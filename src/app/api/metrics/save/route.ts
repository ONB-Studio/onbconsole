// src/app/api/metrics/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg'; // PostgreSQL 쿼리 유틸리티 임포트
import { auth } from '@/lib/auth'; // 인증을 위한 auth 함수 임포트

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  const { siteId, date, gscData } = await req.json();

  if (!siteId || !date || !gscData) {
    return NextResponse.json({ error: '사이트 ID, 날짜, GSC 데이터는 필수입니다.' }, { status: 400 });
  }

  try {
    const result = await query(
      'INSERT INTO metrics_history (site_id, date, gsc) VALUES ($1, $2, $3) ON CONFLICT (site_id, date) DO UPDATE SET gsc = EXCLUDED.gsc, created_at = NOW() RETURNING id, site_id, date, gsc, created_at',
      [siteId, date, gscData]
    );
    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (e: any) {
    console.error('지표 저장 실패:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}