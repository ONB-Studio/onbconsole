// src/components/AddSiteForm.tsx
"use client";
import { useState } from 'react';
import styles from '@/app/page.module.css';

interface AddSiteFormProps {
  onSiteAdded: () => void;
}

export default function AddSiteForm({ onSiteAdded }: AddSiteFormProps) {
  const [siteUrl, setSiteUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl) {
      setError('Please enter a site URL.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to add site.');
      }
      setSiteUrl('');
      onSiteAdded(); // Re-fetch the sites list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addSiteForm}>
      <input
        type="text"
        value={siteUrl}
        onChange={(e) => setSiteUrl(e.target.value)}
        placeholder="https://example.com"
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Site'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
