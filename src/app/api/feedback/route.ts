// src/app/api/feedback/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// API 키를 환경 변수에서 가져옵니다.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    // 1. 클라이언트에서 보낸 요청 데이터 파싱
    // 예시: { businessInfo: "...", gscData: "...", ga4Data: "..." }
    const requestData = await req.json();
    const { businessInfo, gscData, ga4Data } = requestData;

    if (!businessInfo) {
      return NextResponse.json(
        { error: '분석할 비즈니스 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    // 2. Gemini 모델에 전달할 프롬프트(명령어) 구성
    const prompt = `
      당신은 디지털 마케팅 및 브랜딩 전략 전문가입니다.
      아래 제공된 정보를 바탕으로, 해당 비즈니스의 온라인 활동에 대한 날카로운 분석과 실행 가능한 액션 아이템을 제안해주세요.

      ### 1. 분석 대상 비즈니스 정보
      ${businessInfo}

      ### 2. 최근 주요 마케팅 지표
      - Google Search Console (GSC) 데이터: ${gscData || '데이터 없음'}
      - Google Analytics 4 (GA4) 데이터: ${ga4Data || '데이터 없음'}

      ### 3. 분석 및 제안 요청사항
      1.  **종합 진단:** 현재 비즈니스 정보와 마케팅 지표를 종합하여 온라인에서의 강점, 약점, 기회 요인을 분석해주세요.
      2.  **단기 액션 아이템 (3가지):** 당장 실행해볼 수 있는 구체적인 마케팅/브랜딩 활동 3가지를 우선순위와 함께 제안해주세요.
      3.  **장기 방향성:** 이 비즈니스가 1년 뒤 어떤 모습이어야 할지 장기적인 관점의 목표와 방향성을 제시해주세요.

      결과는 마크다운 형식으로, 각 항목을 명확하게 구분하여 작성해주세요.
    `;

    // 3. Gemini API 호출
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedbackText = response.text();

    // 4. 결과를 클라이언트에 전송
    return NextResponse.json({ feedback: feedbackText });

  } catch (error) {
    console.error('Gemini API 호출 오류:', error);
    return NextResponse.json(
      { error: 'AI 피드백을 생성하는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}