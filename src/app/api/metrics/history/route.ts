import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 지표 이력 조회 (GET)
export async function GET() {
  const { data, error } = await supabase.from('metrics_history').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// 지표 이력 저장 (POST)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('metrics_history').insert([body]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}