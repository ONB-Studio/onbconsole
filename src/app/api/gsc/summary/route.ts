// src/app/api/gsc/summary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  const body = await req.json();
  const { siteUrl, startDate, endDate } = body;

  if (!siteUrl || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
        siteUrl
      )}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 10,
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('GSC summary fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
