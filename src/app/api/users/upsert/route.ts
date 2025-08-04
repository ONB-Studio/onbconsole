// src/app/api/users/upsert/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // This logic is more aligned with v5 adapter. In v4, the SupabaseAdapter handles this automatically.
  // This endpoint is redundant with the v4 adapter.
  console.warn("API Route /api/users/upsert is likely redundant with NextAuth v4's SupabaseAdapter.");
  const user = session.user;
  return NextResponse.json({ message: 'User data is handled by adapter.', user });
}
