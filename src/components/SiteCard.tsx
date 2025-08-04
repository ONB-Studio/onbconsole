// src/components/SiteCard.tsx
"use client";

import { Site } from '@/hooks/useSites';
import styles from '@/app/page.module.css';

// SiteCard가 받을 데이터의 타입을 정의합니다.
interface SiteCardProps {
    site: Site;
}

// props로 site 객체를 받도록 수정합니다.
export default function SiteCard({ site }: SiteCardProps) {
    const handleSync = async () => {
        alert(`Syncing data for ${site.site_url}`);
        // Add actual sync logic here
    };

    return (
        <div className={styles.card}>
            <h2>{site.site_url}</h2>
            <p>Added on: {new Date(site.created_at).toLocaleDateString()}</p>
            <button onClick={handleSync}>Sync GSC Data</button>
        </div>
    );
}

