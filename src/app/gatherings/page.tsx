'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function GatheringsPage() {
  const { token } = useAuth();
  const router = useRouter();

  const handleCreateGathering = () => {
    router.push('/gatherings/create'); // 예: 모임 생성 페이지 경로
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">모임 목록</h1>

        {token && (
          <button
            onClick={handleCreateGathering}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            + 모임 만들기
          </button>
        )}
      </div>

      <div className="border p-6 text-center text-gray-600 rounded-md">
        여기 모임 목록이 표시됩니다
      </div>
    </div>
  );
}
