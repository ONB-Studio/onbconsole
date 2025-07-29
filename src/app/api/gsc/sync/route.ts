// 예시: src/app/api/gsc/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { syncGSC } from '@/lib/gscSync';
import { auth } from '@/lib/auth'; // auth 함수를 src/lib/auth에서 직접 임포트

export async function POST(req: NextRequest) {
  const session = await auth(); // getServerSession 대신 auth() 호출
  // ✔️ id 기반 인증 체크
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No user' }, { status: 401 });
  }

  const { siteId } = await req.json();

  try {
    const data = await syncGSC(session.user.id, siteId);
    return NextResponse.json({ data });
  } catch (e: any) {
    console.error('GSC 동기화 실패:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}