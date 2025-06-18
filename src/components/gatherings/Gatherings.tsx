'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { GatheringLocation, GatheringType, SortBy, SortOrder } from '@/types/gatherings';
import { useInfiniteGatherings } from '@/hooks/api/useInfiniteGatherings';
import GatheringCard from './GatheringCard';
import CreateGatheringDialog from './CreateGatheringDialog';

type MainCategory = 'DALLAEMFIT' | 'WORKATION';
type SubCategory = 'ALL' | 'OFFICE_STRETCHING' | 'MINDFULNESS' | null;

export default function Gatherings() {
  const router = useRouter();
  const { token } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 로그인 후 다시 모달 띄우기
  useEffect(() => {
    if (token && sessionStorage.getItem('openCreateModal') === 'true') {
      setIsDialogOpen(true);
      sessionStorage.removeItem('openCreateModal');
    }
  }, [token]);

  const handleOpenCreate = () => {
    if (!token) {
      sessionStorage.setItem('openCreateModal', 'true');
      router.push('/login');
    } else {
      setIsDialogOpen(true);
    }
  };

  const [mainCategory, setMainCategory] = useState<MainCategory>('DALLAEMFIT');
  const [subCategory, setSubCategory] = useState<SubCategory>('ALL');
  const [location, setLocation] = useState<GatheringLocation | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('dateTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const selectedType: GatheringType | undefined =
    mainCategory === 'WORKATION'
      ? 'WORKATION'
      : subCategory === 'ALL' || subCategory === null
      ? undefined
      : subCategory;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteGatherings({
    type: selectedType,
    location: location === 'ALL' ? undefined : location,
    sortBy,
    sortOrder,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">함께 할 사람이 없나요?</p>
          <h2 className="text-2xl font-bold">지금 모임에 참여해보세요</h2>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          모임 만들기
        </button>
      </div>

      {/* 대분류 */}
      <div className="flex gap-6 text-sm font-semibold mb-4">
        {(['DALLAEMFIT', 'WORKATION'] as MainCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setMainCategory(cat);
              setSubCategory(cat === 'DALLAEMFIT' ? 'ALL' : null);
            }}
            className={`flex items-center gap-1 pb-1 ${
              mainCategory === cat
                ? 'border-b-2 border-black text-black'
                : 'text-gray-400'
            }`}
          >
            <span>{cat === 'DALLAEMFIT' ? '달램핏' : '워케이션'}</span>
            <span>{cat === 'DALLAEMFIT' ? '🧘‍♀️' : '🌴'}</span>
          </button>
        ))}
      </div>

      {/* 소분류 */}
      {mainCategory === 'DALLAEMFIT' && (
        <div className="flex gap-2 mb-6">
          {[{ key: 'ALL', label: '전체' },
            { key: 'OFFICE_STRETCHING', label: '오피스 스트레칭' },
            { key: 'MINDFULNESS', label: '마인드풀니스' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSubCategory(item.key as SubCategory)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                subCategory === item.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* 필터바 */}
      <div className="flex justify-between flex-wrap items-center gap-2 mb-4">
        <div className="flex gap-2">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as GatheringLocation | 'ALL')}
            className="border px-3 py-2 text-sm rounded"
          >
            <option value="ALL">지역 전체</option>
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
            <option value="dateTime">날짜 전체</option>
            <option value="registrationEnd">마감 임박</option>
            <option value="participantCount">참여 인원</option>
          </select>
        </div>

        <button
          onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded bg-gray-100 text-gray-800"
        >
          <span className="text-lg leading-none">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
          마감 임박
        </button>
      </div>

      {/* 리스트 */}
      {isLoading && <p className="text-center">불러오는 중...</p>}
      {isError && <p className="text-center text-red-500">에러가 발생했어요.</p>}
      {data && (
        <div className="flex flex-col gap-6">
          {data.pages.flatMap((page) =>
            page.map((gathering) => (
              <GatheringCard key={gathering.id} gathering={gathering} />
            ))
          )}
        </div>
      )}
      <div ref={observerRef} className="h-8" />
      {isFetchingNextPage && <p className="text-center mt-2">로딩 중...</p>}

      {/* 모달 열기 */}
      {isDialogOpen && <CreateGatheringDialog onClose={() => setIsDialogOpen(false)} />}
    </div>
  );
}
