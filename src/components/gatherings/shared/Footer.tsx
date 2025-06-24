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
  const [isJoinedState, setIsJoinedState] = useState<boolean>(initialJoined);

  useEffect(() => {
    const joinedFlag = localStorage.getItem(`joined_${gatheringId}`) === 'true';
    setIsJoinedState(joinedFlag);
  }, [gatheringId]);

  return (
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold">
            더 건강한 나와 팀을 위한 프로그램 🏃‍♂️,
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            국내 최고 웰니스 전문가와 프로그램을 통해 지친 몸과 마음을 회복해봐요
          </p>
        </div>
        
        {isOwner ? (
          <div className="flex gap-4">
            <button
              onClick={onCancelMeeting}
              className="px-6 py-2 bg-red-100 text-red-600 rounded-xl text-lg hover:bg-red-200 transition"
            >
              모임 취소하기
            </button>
          </div>
  
        ) : !isLoggedIn ? (
          <button
            onClick={onLoginPrompt}
            className="px-6 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
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
            className="px-6 py-2 rounded-xl border border-orange-500 text-orange-500 hover:bg-orange-50 transition"
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
            className={`px-6 py-2 rounded-xl font-semibold transition ${
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
