// src/app/api/ads/summary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  const body = await req.json();
  const { customerId, startDate, endDate } = body;

  if (!customerId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const query = `
    SELECT
      metrics.clicks,
      metrics.ctr,
      metrics.impressions,
      metrics.cost_micros
    FROM
      customer
    WHERE
      segments.date BETWEEN '${startDate}' AND '${endDate}'
  `;

  try {
    const response = await fetch(
      `https://googleads.googleapis.com/v14/customers/${customerId}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          'login-customer-id': process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      }
    );

    const text = await response.text(); // ⚠️ fetch 후에 호출해야 함
    console.log('📥 Google Ads 응답 (text):', text);

    const data = JSON.parse(text); // JSON 파싱
    console.log('📥 Google Ads 응답 (parsed):', data);

    if (data.error) {
      return NextResponse.json({ error: 'Google Ads API 오류', details: data.error }, { status: 500 });
    }

    return NextResponse.json({
      clicks: data.results?.[0]?.metrics?.clicks || 0,
      ctr: data.results?.[0]?.metrics?.ctr || 0,
      impressions: data.results?.[0]?.metrics?.impressions || 0,
      costMicros: data.results?.[0]?.metrics?.costMicros || 0,
    });
  } catch (err) {
    console.error('Google Ads 응답 파싱 오류:', err);
    return NextResponse.json({ error: '응답이 JSON이 아닙니다', reason: String(err) }, { status: 500 });
  }
}
