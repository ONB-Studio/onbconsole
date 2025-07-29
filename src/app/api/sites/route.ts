// src/app/api/sites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg';
import { auth } from '@/lib/auth'; // 인증을 위한 auth 함수 임포트

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  try {
    const result = await query('SELECT id, title, domain, created_at FROM sites WHERE user_id = $1 ORDER BY created_at DESC', [session.user.id]);
    return NextResponse.json({ data: result.rows });
  } catch (e: any) {
    console.error('사이트 조회 실패:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  const { title, domain } = await req.json();
  if (!title || !domain) {
    return NextResponse.json({ error: '제목과 도메인은 필수입니다.' }, { status: 400 });
  }

  try {
    const result = await query(
      'INSERT INTO sites (user_id, title, domain) VALUES ($1, $2, $3) RETURNING id, title, domain, created_at',
      [session.user.id, title, domain]
    );
    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (e: any) {
    console.error('사이트 추가 실패:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}