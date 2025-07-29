// src/app/api/users/upsert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // 기존 import
import { auth } from '@/lib/auth'; // 💡 next-auth v5의 auth 함수 임포트

export async function POST(req: NextRequest) {
  const session = await auth(); // 💡 auth() 함수로 세션 가져오기

  // ✔️ 세션 및 사용자 ID 기반 인증 체크 (필수)
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  const supabase = createClient();
  const { user } = await req.json(); // 요청 본문에서 사용자 정보 추출

  if (!user) {
    return NextResponse.json({ error: '사용자 정보가 필요합니다.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('users') // 'users' 테이블 이름 확인
      .upsert({
        id: session.user.id, // 세션의 user id 사용
        email: session.user.email, // 세션의 email 사용
        name: session.user.name, // 세션의 name 사용
        // 추가적인 사용자 필드가 있다면 여기에 포함
      }, { onConflict: 'id' }); // id 충돌 시 업데이트

    if (error) {
      console.error('사용자 upsert 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '사용자 정보가 성공적으로 처리되었습니다.', data });
  } catch (e: any) {
    console.error('사용자 upsert 중 예외 발생:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}