'use client';

import { useEffect } from 'react';
import CreateGatheringForm from './CreateGatheringForm';

export default function CreateGatheringDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
      <div
        className="
          w-full 
          max-w-[520px] 
          h-[580px] 
          bg-white 
          rounded-xl 
          overflow-y-auto 
          p-6 
          relative 
          shadow-xl
        "
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">모임 만들기</h2>
        <CreateGatheringForm />
      </div>
    </div>
  );
}
