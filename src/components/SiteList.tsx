// src/components/SiteList.tsx
import SiteCard from './SiteCard';
import styles from '@/app/page.module.css';
import { Site } from '@/hooks/useSites';

interface SiteListProps {
  sites: Site[];
  isLoading: boolean;
  error: Error | null;
}

export default function SiteList({ sites, isLoading, error }: SiteListProps) {
  if (isLoading) {
    return <p>Loading sites...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error loading sites: {error.message}</p>;
  }

  if (sites.length === 0) {
    return <p>No sites added yet. Add one above to get started!</p>;
  }

  return (
    <div className={styles.grid}>
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
