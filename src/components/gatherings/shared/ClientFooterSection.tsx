'use client';

import { useAuth } from '@/providers/AuthProvider';
import Footer from '@/components/gatherings/shared/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';
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

  const storageKey = userId
    ? `joined_${userId}_${gatheringId}`
    : '';

  const [isJoined, setIsJoined] = useState(false);
  useEffect(() => {
    if (!userId) {
      setIsJoined(false);
      return;
    }
    setIsJoined(localStorage.getItem(storageKey) === 'true');
  }, [storageKey, userId]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [currentCount, setCurrentCount] = useState(participantCount);

  const isLoggedIn = !!token;
  const isOwner = userId === createdBy;
  const isFull = participantCount >= capacity;

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const onJoin = async () => {
    if (!token) return onLoginPrompt();

    try {
      setIsSubmitting(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/gatherings/${gatheringId}/join`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if ([200, 201].includes(res.status)) {
        // userId 포함된 key로 저장
        localStorage.setItem(storageKey, 'true');
        setIsJoined(true);
        setDialogMessage('참여 완료되었습니다!');
        setCurrentCount((prev) => prev + 1);
        setShowDialog(true);
        router.refresh();
      }
    } catch (err: any) {
      const code = err?.response?.data?.code;
      setDialogMessage(
        code === 'ALREADY_JOINED'
          ? '이미 참여한 모임입니다.'
          : '참여 중 오류가 발생했습니다.'
      );
      setShowDialog(true);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancelJoin = async () => {
    if (!token) return onLoginPrompt();

    try {
      setIsSubmitting(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URI}/gatherings/${gatheringId}/leave`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem(storageKey);
      setIsJoined(false);
      setDialogMessage('참여가 취소되었습니다.');
      setCurrentCount((prev) => prev - 1);
      setShowDialog(true);
      router.refresh();
    } catch {
      setDialogMessage('참여 취소 중 오류가 발생했습니다.');
      setShowDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancelMeeting = () => {
    setDialogMessage('모임이 취소 되었습니다.');
    setShowDialog(true);
    router.refresh();
  };

  const onShare = () => {
    setDialogMessage('공유하기 기능을 호출합니다.');
    setShowDialog(true);
  };

  const onLoginPrompt = () => {
    setDialogMessage('로그인 후 참여가 가능합니다.');
    setShowDialog(true);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow z-10">
        <div className="max-w-5xl mx-auto">
          <Footer
            gatheringId={gatheringId}
            isLoggedIn={isLoggedIn}
            isOwner={isOwner}
            isJoined={isJoined}
            isFull={isFull || isSubmitting}
            isSubmitting={isSubmitting}
            onJoin={onJoin}
            onCancelJoin={onCancelJoin}
            onCancelMeeting={onCancelMeeting}
            onShare={onShare}
            onLoginPrompt={onLoginPrompt}
          />
        </div>
      </div>

      {showDialog && (
        <Dialog onClose={handleDialogClose}>
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <p className="text-center text-base font-semibold mb-6">
              {dialogMessage}
            </p>
            <div className="flex gap-4">
              <button
                className="bg-orange-500 text-white px-6 py-2 rounded-lg"
                onClick={handleDialogClose}
              >
                확인
              </button>
              {dialogMessage === '로그인 후 참여가 가능합니다.' && (
                <button
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg"
                  onClick={() => router.push('/login')}
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
