'use client';

import React, { useEffect, useState } from 'react';

interface FooterProps {
  gatheringId: string;
  isLoggedIn: boolean;
  isOwner: boolean;
  isFull: boolean;
  isSubmitting: boolean;
  isJoined: boolean;
  onJoin: () => void;
  onCancelJoin: () => void;
  onCancelMeeting: () => void;
  onShare: () => void;
  onLoginPrompt: () => void;
}

export default function Footer({
  gatheringId,
  isLoggedIn,
  isOwner,
  isFull,
  isSubmitting,
  isJoined: initialJoined,   
  onJoin,
  onCancelJoin,
  onCancelMeeting,
  onShare,
  onLoginPrompt,
}: FooterProps) {
  // 로컬 스토리지 + prop 싱크를 위한 내부 state
  const [isJoinedState, setIsJoinedState] = useState<boolean>(initialJoined);

  // 마운트 혹은 gatheringId 변경 시 로컬 스토리지 읽어오기
  useEffect(() => {
    const joinedFlag = localStorage.getItem(`joined_${gatheringId}`) === 'true';
    setIsJoinedState(joinedFlag);
  }, [gatheringId]);

  return (
    <div className="flex items-center justify-center w-full">
      {/* 모임 주최자 */}
      {isOwner ? (
        <div className="flex gap-4 w-full">
          <button
            onClick={onShare}
            className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            공유하기
          </button>
          <button
            onClick={onCancelMeeting}
            className="flex-1 bg-red-100 text-red-600 py-3 rounded-lg hover:bg-red-200 transition"
          >
            모임 취소하기
          </button>
        </div>

      ) : !isLoggedIn ? (
        <button
          onClick={onLoginPrompt}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
        >
          참여하기
        </button>

      ) : isJoinedState ? (
        <button
          onClick={() => {
            onCancelJoin();
            setIsJoinedState(false);
          }}
          disabled={isSubmitting}
          className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition"
        >
          참여 취소하기
        </button>

      ) : (
        <button
          onClick={() => {
            onJoin();
            setIsJoinedState(true);
          }}
          disabled={isFull || isSubmitting}
          className={`w-full py-3 rounded-lg transition ${
            isFull || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? '참여 중' : '참여하기'}
        </button>
      )}
    </div>
  );
}
