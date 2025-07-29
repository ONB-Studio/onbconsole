// src/components/AddSiteForm.tsx
'use client';

import { useState } from 'react';

type AddSiteFormProps = {
  onAddSite: (title: string, domain: string) => Promise<void>;
};

export default function AddSiteForm({ onAddSite }: AddSiteFormProps) {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !domain) {
      alert('별칭과 도메인을 모두 입력하세요!');
      return;
    }
    setIsSubmitting(true);
    await onAddSite(title, domain);
    setTitle('');
    setDomain('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '16px 0' }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="사이트 별칭"
        disabled={isSubmitting}
      />
      <input
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="https://example.com"
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '추가 중...' : '사이트 추가'}
      </button>
    </form>
  );
}