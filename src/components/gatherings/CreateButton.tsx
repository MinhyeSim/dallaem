'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function CreateButton() {
  const { token } = useAuth();
  const router = useRouter();

  if (!token) return null;

  return (
    <button
      onClick={() => router.push('/gatherings/create')}
      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
    >
      + 모임 만들기
    </button>
  );
}
