'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface UserMenuProps {
  userName: string;
  avatarSrc: string;
  onLogout: () => void;
}

export default function UserMenu({ userName, avatarSrc, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="focus:outline-none"
      >
        <Image
          src={avatarSrc}
          alt="프로필"
          width={36}
          height={36}
          className="rounded-full border-2 border-white"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* userName */}
          <div className="px-3 py-1.5 text-orange-500 font-semibold border-b border-gray-100 text-center">
            {userName}
          </div>
          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full px-3 py-1.5 text-gray-900 hover:bg-gray-100 text-center"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
