'use client';

import { useAuth } from '@/providers/AuthProvider';
import Footer from '@/components/gatherings/shared/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import Dialog from '@/components/shared/ui/Dialog';

interface Props {
  gatheringId: string;
  createdBy: number;
  participantCount: number;
  capacity: number;
}

export default function ClientFooterSection({
  gatheringId,
  createdBy,
  participantCount,
  capacity,
}: Props) {
  const router = useRouter();
  const { token, userId } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const isLoggedIn = !!token;
  const isOwner = userId === createdBy;
  const isFull = participantCount >= capacity;

  const onJoin = async () => {
    if (!token) return onLoginPrompt();

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/gatherings/${gatheringId}/join`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.data?.code === 'ALREADY_JOINED') {
        setIsJoined(true);
        setShowDialog(true);
      }
    } catch (error: any) {
      console.error('참여 실패:', error.response?.data || error.message);
      alert('❌ 참여 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancelJoin = () => {
    setIsJoined(false);
    alert('❌ 참여 취소 요청');
  };

  const onCancelMeeting = () => {
    alert('⚠️ 모임 취소 요청');
  };

  const onShare = () => {
    alert('📤 공유하기');
  };

  const onLoginPrompt = () => {
    alert('🔐 로그인해주세요');
    router.push('/login');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow z-10">
        <div className="max-w-5xl mx-auto">
          <Footer
            isLoggedIn={isLoggedIn}
            isOwner={isOwner}
            isJoined={isJoined}
            isFull={isFull || isSubmitting}
            onJoin={onJoin}
            onCancelJoin={onCancelJoin}
            onCancelMeeting={onCancelMeeting}
            onShare={onShare}
            onLoginPrompt={onLoginPrompt}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {showDialog && (
        <Dialog onClose={() => setShowDialog(false)}>
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <p className="text-center text-base font-semibold mb-6">참여 완료되었습니다!</p>
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
              onClick={() => setShowDialog(false)}
            >
              확인
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
