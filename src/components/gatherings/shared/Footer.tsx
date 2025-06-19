'use client';

import React from 'react';

interface FooterProps {
  isLoggedIn: boolean;
  isOwner: boolean;
  isJoined: boolean;
  isFull: boolean;
  isSubmitting: boolean;
  onJoin: () => void;
  onCancelJoin: () => void;
  onCancelMeeting: () => void;
  onShare: () => void;
  onLoginPrompt: () => void;
}

export default function Footer({
  isLoggedIn,
  isOwner,
  isJoined,
  isFull,
  isSubmitting,
  onJoin,
  onCancelJoin,
  onCancelMeeting,
  onShare,
  onLoginPrompt,
}: FooterProps) {
  return (
    <div>
      {isOwner ? (
        <div className="flex gap-4">
          <button
            onClick={onShare}
            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            공유하기
          </button>
          <button
            onClick={onCancelMeeting}
            className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition"
          >
            모임 취소하기
          </button>
        </div>
      ) : isLoggedIn ? (
        isJoined ? (
          <button
            onClick={onCancelJoin}
            className="w-full text-orange-500 border border-orange-500 py-3 rounded-lg hover:bg-orange-50 transition"
          >
            참여 취소하기
          </button>
        ) : (
          <button
            onClick={onJoin}
            disabled={isFull || isSubmitting}
            className={`w-full py-3 rounded-lg transition ${
              isFull || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isSubmitting ? '참여 중' : '참여하기'}
          </button>
        )
      ) : (
        <button
          onClick={onLoginPrompt}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
        >
          참여하기
        </button>
      )}
    </div>
  );
}
