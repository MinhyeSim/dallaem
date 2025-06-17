'use client';

import { useState } from 'react';
import { useGatherings } from '@/hooks/api/useGatherings';
import GatheringCard from './GatheringCard';
import { GatheringType, GatheringLocation, SortBy, SortOrder } from '@/types/gatherings';

export default function Gatherings() {
  const [type, setType] = useState<GatheringType | 'ALL'>('ALL');
  const [location, setLocation] = useState<GatheringLocation | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('dateTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const { data, isLoading, isError } = useGatherings({
    type: type === 'ALL' ? undefined : type,
    location: location === 'ALL' ? undefined : location,
    sortBy,
    sortOrder,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 제목 */}
      <h2 className="text-2xl font-bold mb-4">지금 모임에 참여해보세요</h2>

      {/* 필터: 유형 */}
      <div className="flex gap-2 mb-4">
        {['ALL', 'DALLAEMFIT', 'OFFICE_STRETCHING', 'MINDFULNESS', 'WORKATION'].map((t) => (
          <button
            key={t}
            onClick={() => setType(t as GatheringType | 'ALL')}
            className={`px-3 py-1 rounded-full border text-sm ${type === t ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
          >
            {t === 'ALL' ? '전체' : t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* 필터: 지역, 정렬 */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value as GatheringLocation | 'ALL')}
          className="border px-3 py-2 text-sm rounded"
        >
          <option value="ALL">전체 지역</option>
          <option value="건대입구">건대입구</option>
          <option value="을지로3가">을지로3가</option>
          <option value="신림">신림</option>
          <option value="홍대입구">홍대입구</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="border px-3 py-2 text-sm rounded"
        >
          <option value="dateTime">모임 날짜</option>
          <option value="registrationEnd">마감 임박</option>
          <option value="participantCount">참여 인원</option>
        </select>
      </div>

      {/* 모임 리스트 */}
      {isLoading && <p className="text-center">불러오는 중...</p>}
      {isError && <p className="text-center text-red-500">에러가 발생했어요.</p>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.map((gathering) => (
            <GatheringCard key={gathering.id} gathering={gathering} />
          ))}
        </div>
      )}
    </div>
  );
}
