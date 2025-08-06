// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AuthStatus from "@/components/AuthStatus";
import SiteCard from "@/components/SiteCard";
import HistoryModal from "@/components/HistoryModal";

export default function Page() {
  const { data: session } = useSession();
  const [sites, setSites] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDomain, setSiteDomain] = useState("");

  // 사이트 리스트 불러오기
  const fetchSites = async () => {
    const res = await fetch("/api/sites");
    const json = await res.json();
    setSites(json.data || []);
  };

  // 이력 불러오기
  const fetchHistory = async () => {
    const res = await fetch("/api/metrics/history");
    const json = await res.json();
    setHistory(json.data || []);
  };

  // 로그인 후 사이트, 유저, 이력 fetch
  useEffect(() => {
    if (session) {
      fetchSites();
      fetchHistory();
    }
  }, [session]);

  // 사이트 추가
  const handleAddSite = async () => {
    if (!siteTitle || !siteDomain) return alert("별칭/도메인 입력!");
    await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: siteTitle, domain: siteDomain }),
    });
    setSiteTitle("");
    setSiteDomain("");
    fetchSites();
  };

  // 사이트 삭제
  const handleDeleteSite = async (id: string) => {
    await fetch(`/api/sites/${id}`, { method: "DELETE" });
    fetchSites();
  };

  // 지표 수정 or 동기화 (예시/더미)
  const handleUpdateData = async (
    site_id: string,
    group: string,
    key: string,
    value: number
  ) => {
    await fetch("/api/metrics/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site_id,
        date: new Date().toISOString().slice(0, 10),
        [group]: { [key]: value },
      }),
    });
    fetchHistory();
  };

  return (
    <div>
      <AuthStatus />
      {/* 사이트 추가 폼 */}
      <div style={{ margin: "16px 0" }}>
        <input
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          placeholder="사이트 별칭"
        />
        <input
          value={siteDomain}
          onChange={(e) => setSiteDomain(e.target.value)}
          placeholder="사이트 도메인"
        />
        <button onClick={handleAddSite}>사이트 추가</button>
      </div>
      <button onClick={fetchSites}>사이트 새로고침</button>
      <button
        onClick={() => {
          fetchHistory();
          setShowHistory(true);
        }}
      >
        이력 보기
      </button>
      {/* 사이트 카드 리스트 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {sites.map((site) => (
          <SiteCard
            key={site.id}
            {...site}
            onDelete={handleDeleteSite}
            onUpdateData={(group, key, value) =>
              handleUpdateData(site.id, group, key, value)
            }
            // onSyncGSC, onSyncGA4, onSyncAds 등 추후 구현
          />
        ))}
      </div>
      {/* 이력 모달 */}
      {showHistory && (
        <HistoryModal history={history} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}

