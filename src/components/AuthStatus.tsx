// src/components/AuthStatus.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>로딩 중...</div>;
  }

  if (session?.user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>안녕하세요, {session.user.name || session.user.email}님</span>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }

  return <button onClick={() => signIn('google')}>Google로 로그인</button>;
}