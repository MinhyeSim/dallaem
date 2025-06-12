'use client';

import { useAuth } from '../providers/AuthProvieder';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { token, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push('/')}>
        달램
      </h1>
      {token ? (
        <button onClick={logout} className="text-sm text-red-500">
          로그아웃
        </button>
      ) : (
        <button onClick={() => router.push('/login')} className="text-sm">
          로그인
        </button>
      )}
    </header>
  );
}
