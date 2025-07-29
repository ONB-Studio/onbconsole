// src/app/api/gsc/sites/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  try {
    const gscRes = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites', {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const data = await gscRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('GSC 호출 오류:', err);
    return NextResponse.json({ error: 'Failed to fetch GSC data' }, { status: 500 });
  }
}

