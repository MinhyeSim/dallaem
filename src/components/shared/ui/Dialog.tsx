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
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl relative w-full max-w-xs">
        <button
          className="absolute top-4 right-4 text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
