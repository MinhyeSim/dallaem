'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function Navbar() {
  const router = useRouter();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-[#f45b0f] text-white py-4 shadow">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* 왼쪽: 로고 + 메뉴 */}
        <div className="flex items-center space-x-10">
          <div className="cursor-pointer w-32" onClick={() => router.push('/')}>
            <img
              src="/logo.svg"
              alt="같이달램 로고"
              className="w-full h-auto"
            />
          </div>
          <nav className="flex space-x-6 text-sm font-medium">
            <a href="/gatherings" className="hover:underline">모임 찾기</a>
            <a href="#" className="hover:underline">찜한 모임</a>
            <a href="#" className="hover:underline">모든 리뷰</a>
          </nav>
        </div>

        {/* 오른쪽: 로그인 or 로그아웃 */}
        <div className="text-sm font-medium">
          {token ? (
            <button onClick={handleLogout} className="hover:underline">
              로그아웃
            </button>
          ) : (
            <a href="/login" className="hover:underline">
              로그인
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
