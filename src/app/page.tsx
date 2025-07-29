// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSites } from '@/hooks/useSites';
import AuthStatus from '@/components/AuthStatus';
import AddSiteForm from '@/components/AddSiteForm';
import SiteList from '@/components/SiteList';
import AIFeedback from '@/components/AIFeedback';
import ModalBase from '@/components/ModalBase';

export default function Page() {
  const { data: session, status } = useSession();
  const { sites, isLoading, error, addSite, deleteSite, refetchSites } = useSites();

  // 모달 상태 관리
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // 모달 내용 관리
  const [history, setHistory] = useState<any[]>([]);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);

  // 이력 보기 버튼 클릭 핸들러
  const handleShowHistory = async () => {
    // 실제 이력 fetch 로직
    const res = await fetch('/api/metrics/history');
    const json = await res.json();
    setHistory(json.data || []);
    setIsHistoryModalOpen(true); // 이력 모달을 켭니다.
  };

  // 사이트 삭제 버튼 클릭 핸들러 (SiteList에서 호출)
  const handleDeleteRequest = (id: string) => {
    setSiteToDelete(id); // 삭제할 사이트 ID 저장
    setIsConfirmModalOpen(true); // 삭제 확인 모달을 켭니다.
  };

  // 최종 삭제 실행 핸들러 (모달의 '확인' 버튼에서 호출)
  const handleConfirmDelete = async () => {
    if (siteToDelete) {
      await deleteSite(siteToDelete);
      setSiteToDelete(null); // ID 초기화
      setIsConfirmModalOpen(false); // 모달 닫기
    }
  };

  // 삭제 취소 핸들러
  const handleCancelDelete = () => {
    setSiteToDelete(null);
    setIsConfirmModalOpen(false);
  };

  if (status !== 'authenticated') {
    return (
      <div>
        <AuthStatus />
        <p>서비스를 이용하려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div>
      <AuthStatus />

      <h2>내 사이트</h2>
      <AddSiteForm onAddSite={addSite} />
      <button onClick={refetchSites} disabled={isLoading}>
        {isLoading ? '새로고침 중...' : '사이트 새로고침'}
      </button>
      <button onClick={handleShowHistory}>이력 보기</button>

      <SiteList
        sites={sites}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteRequest} // 삭제 요청 핸들러 연결
      />

      <hr style={{ margin: '32px 0' }} />
      <AIFeedback />

      {/* 범용 모달을 사용한 "삭제 확인" 모달 */}
      <ModalBase isOpen={isConfirmModalOpen} onClose={handleCancelDelete}>
        <div style={{ padding: '20px' }}>
          <h3>사이트 삭제</h3>
          <p>정말 이 사이트를 삭제하시겠습니까? 관련 데이터가 모두 사라집니다.</p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={handleCancelDelete}>취소</button>
            <button onClick={handleConfirmDelete} style={{ background: 'red', color: 'white' }}>삭제</button>
          </div>
        </div>
      </ModalBase>

      {/* 범용 모달을 사용한 "이력 보기" 모달 */}
      <ModalBase isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)}>
        <div style={{ padding: '20px', width: '500px' }}>
          <h3>데이터 수집 이력</h3>
          {history.length > 0 ? (
            <ul>
              {history.map((item, index) => (
                <li key={index}>{item.log}</li>
              ))}
            </ul>
          ) : (
            <p>이력이 없습니다.</p>
          )}
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button onClick={() => setIsHistoryModalOpen(false)}>닫기</button>
          </div>
        </div>
      </ModalBase>
    </div>
  );
}