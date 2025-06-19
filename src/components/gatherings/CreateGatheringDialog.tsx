'use client';

import { useEffect, useContext } from 'react';
import CreateGatheringForm from './CreateGatheringForm';
import { AuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function CreateGatheringDialog({ onClose }: { onClose: () => void }) {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // ESC 키 누르면 모달 닫힘
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
      <div
        className="
          w-full 
          h-full 
          sm:max-w-[520px] 
          sm:h-[580px] 
          sm:rounded-xl 
          bg-white 
          overflow-y-auto 
          p-5 
          relative 
          shadow-xl
        "
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 text-xl z-10"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">모임 만들기</h2>
        {token && <CreateGatheringForm onClose={onClose} />}
      </div>
    </div>
  );
}
