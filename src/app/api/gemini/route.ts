// src/app/api/gemini/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const { metrics } = await req.json();
    if (!metrics || metrics.length === 0) {
      return NextResponse.json({ feedback: 'No data available to analyze.' });
    }

    const prompt = `
      You are a helpful SEO and marketing assistant.
      Based on the following daily performance data for the last 30 days from Google Search Console,
      provide a brief, easy-to-understand analysis and suggest one concrete action item.
      The data is in JSON format: {date, clicks, impressions, ctr, position}.
      Data: ${JSON.stringify(metrics)}
      
      Your response should be in Korean and formatted in simple Markdown.
      Start with a title "### AI 분석 요약".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ feedback: text });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return NextResponse.json({ error: 'Failed to get AI feedback' }, { status: 500 });
  }
}
