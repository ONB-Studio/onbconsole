'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthStatus() {
  const { data: session } = useSession();
  if (session?.user)
    return (
      <div>
        <span>안녕하세요, {session.user.name}</span>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  return <button onClick={() => signIn('google')}>Google로 로그인</button>;
}
