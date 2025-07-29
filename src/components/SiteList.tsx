// src/components/SiteList.tsx
'use client';

import SiteCard from './SiteCard';
import { Site } from '@/hooks/useSites';

type SiteListProps = {
  sites: Site[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
};

export default function SiteList({ sites, isLoading, error, onDelete }: SiteListProps) {
  if (isLoading) {
    return <div>사이트 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>에러: {error}</div>;
  }

  if (sites.length === 0) {
    return <div>등록된 사이트가 없습니다. 새 사이트를 추가해보세요.</div>;
  }

  return (
    <div>
      {sites.map((site) => (
        <SiteCard
          key={site.id}
          {...site}
          onDelete={() => onDelete(site.id)}
        />
      ))}
    </div>
  );
}