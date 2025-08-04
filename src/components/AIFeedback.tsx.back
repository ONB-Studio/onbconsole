// src/components/AIFeedback.tsx
'use client';

import { useState } from 'react';

// 마크다운 렌더링을 위한 라이브러리 (추후 설치 필요)
// npm install react-markdown
import ReactMarkdown from 'react-markdown';


export default function AIFeedback() {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetFeedback = async () => {
    setIsLoading(true);
    setError('');
    setFeedback('');

    try {
      // API에 전달할 데이터 (실제로는 props로 받아오거나 상태에서 가져와야 함)
      const requestBody = {
        businessInfo: 'ONB Console: 마케터를 위한 AI 기반 마케팅 대시보드',
        gscData: '최근 한 달간 노출 10,000회, 클릭 300회',
        ga4Data: '최근 한 달간 사용자 500명, 이탈률 60%',
      };

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '알 수 없는 에러가 발생했습니다.');
      }

      const data = await res.json();
      setFeedback(data.feedback);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>🤖 AI 피드백 (Gemini)</h3>
      <p>현재 설정된 비즈니스 정보를 바탕으로 AI가 종합 분석을 제공합니다.</p>
      <button onClick={handleGetFeedback} disabled={isLoading}>
        {isLoading ? '분석 중...' : 'AI 피드백 받기'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '16px' }}>에러: {error}</div>}

      {feedback && (
        <div style={{ marginTop: '16px', background: '#f9f9f9', padding: '16px' }}>
          {/* ReactMarkdown을 사용하면 줄바꿈, 글머리 기호 등이 예쁘게 표시됩니다 */}
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}