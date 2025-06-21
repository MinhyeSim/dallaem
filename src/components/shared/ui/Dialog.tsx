'use client';

import { X } from 'lucide-react';

export default function Dialog({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl relative w-full max-w-sm min-h-[100px] p-6 shadow-xl">
        <button
          className="absolute top-3 right-3 text-gray-700 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>
  
      <div className="text-center">
        {children}
      </div>
    </div>
  </div>
  
  );
}
