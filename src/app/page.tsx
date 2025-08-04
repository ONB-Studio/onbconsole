// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import AuthStatus from "@/components/AuthStatus";
import SiteList from "@/components/SiteList";
import styles from "./page.module.css";
import AddSiteForm from "@/components/AddSiteForm";
import useSites, { Site } from "@/hooks/useSites";
import AIFeedback from '@/components/AIFeedback';

export default function Home() {
  const { data: session, status } = useSession();
  const { sites, isLoading: sitesLoading, error: sitesError, mutate: mutateSites } = useSites();
  
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [aiFeedback, setAiFeedback] = useState('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const handleSiteSelect = async (site: Site) => {
    setSelectedSite(site);
    setAiFeedback(''); // Reset feedback when a new site is selected
    
    // Fetch metrics for the selected site
    const res = await fetch(`/api/metrics/history?siteId=${site.id}`);
    const data = await res.json();
    setMetrics(data);
  };

  const getAIFeedback = async () => {
    if (!selectedSite || metrics.length === 0) return;

    setIsFeedbackLoading(true);
    try {
      // (✨ 수정) /api/feedback 대신 /api/gemini를 호출합니다.
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      });
      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch (error) {
      console.error("Failed to get AI feedback", error);
      setAiFeedback("죄송합니다. 지금은 피드백을 생성할 수 없습니다.");
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  if (status === "loading") {
    return <main className={styles.main}><p>세션 정보를 불러오는 중...</p></main>;
  }

  if (!session) {
    return (
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            환영합니다! 계속하려면 로그인해주세요.
          </p>
          <div>
            <AuthStatus />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>My Dashboard</h1>
        <AuthStatus />
      </header>
      
      <AddSiteForm onSiteAdded={mutateSites} />
      
      <SiteList sites={sites} isLoading={sitesLoading} error={sitesError} />

      <div className={styles.detailsSection}>
        <h2>사이트 상세 정보</h2>
        <p>위 목록에서 사이트를 선택하여 상세 지표를 확인하고 AI 분석을 받아보세요.</p>
        <div>
          {sites.map(site => (
            <button key={site.id} onClick={() => handleSiteSelect(site)} className={selectedSite?.id === site.id ? styles.selected : ''}>
              {site.site_url}
            </button>
          ))}
        </div>

        {selectedSite && (
          <div>
            <h3>{selectedSite.site_url} 지표</h3>
            <button onClick={getAIFeedback} disabled={isFeedbackLoading || metrics.length === 0}>
              {metrics.length === 0 ? '분석할 지표 없음' : 'AI 분석 받기'}
            </button>
            <AIFeedback feedback={aiFeedback} isLoading={isFeedbackLoading} />
            <pre>{JSON.stringify(metrics, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
