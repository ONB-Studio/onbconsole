// src/components/SiteCard.tsx
'use client';

import React from 'react';

type SiteCardProps = {
  id: string;
  title: string;
  domain: string;
  onDelete: (id: string) => void;
};

export default function SiteCard({ id, title, domain, onDelete }: SiteCardProps) {
  return (
    <div className="site-card">
      <h3>{title}</h3>
      <span>{domain}</span>
      <button onClick={() => onDelete(id)}>삭제</button>
    </div>
  );
}
