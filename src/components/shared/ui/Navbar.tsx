'use client';

import React, { useContext, useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, signout, userName } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    signout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/gatherings', label: '모임 찾기' },
    { href: '/saved',      label: '찜한 모임' },
    { href: '/reviews',    label: '모든 리뷰' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#f45b0f] text-white font-bold text-sm md:text-base shadow">
      <div className="max-w-screen-lg mx-auto h-14 px-4 flex justify-between items-center">
        {/* 왼쪽: 로고 + 메뉴 */}
        <section className="flex gap-6 items-center">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="같이달램 로고"
              width={100}
              height={100}
              className="w-[5rem] h-auto pointer-events-none"
            />
          </Link>
          <div className="flex gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                transition-colors duration-200
                ${pathname.startsWith(link.href) ? 'text-black' : 'text-white'}
                hover:opacity-80
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* 오른쪽: 로그인 또는 커스텀 토글 메뉴 */}
        <section className="flex items-center">
          {token ? (
            <div ref={menuRef} className="relative">
              {/* Trigger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="focus:outline-none"
              >
                <Image
                  src="/profile.svg"
                  alt="프로필"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-white"
                />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 text-orange-500 font-semibold border-b border-gray-100">
                    {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:underline">
              로그인
            </Link>
          )}
        </section>
      </div>
    </nav>
  );
}
