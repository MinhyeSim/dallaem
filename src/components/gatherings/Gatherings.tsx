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
    <main className="min-h-screen bg-gray-100 px-4">
       <section className="max-w-6xl mx-auto bg-gray-50 rounded-t-xl p-12 shadow-sm -mt-2">
            {/* 헤더 */}
            <div className="flex items-center gap-4 mb-2">
              {/* 왼쪽 이모지 이미지 */}
              <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-400 bg-[#fff5eb]">
                <span className="text-3xl">💞</span>
              </div>

              {/* 텍스트 영역 */}
              <div>
                <p className="text-sm text-gray-500">함께 할 사람이 없나요?</p>
                <h2 className="text-2xl font-bold text-gray-900">지금 모임에 참여해보세요</h2>
              </div>
            </div>

            {/* 대분류 + 모임 만들기 버튼 */}
            <div className="flex justify-between items-center mb-2">
              {/* 대분류 버튼 */}
              <div className="flex gap-6 text-sm font-semibold">
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

              {/* 모임 만들기 버튼 */}
              <button
                onClick={handleOpenCreate}
                className="bg-orange-500 text-white px-4 py-3 rounded-xl text-sm font-semibold"
              >
                모임 만들기
              </button>
            </div>

            {/* 소분류 */}
            {mainCategory === 'DALLAEMFIT' && (
              <div className="flex gap-2 mb-4">
                {[{ key: 'ALL', label: '전체' },
                  { key: 'OFFICE_STRETCHING', label: '오피스 스트레칭' },
                  { key: 'MINDFULNESS', label: '마인드풀니스' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSubCategory(item.key as SubCategory)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium ${
                      subCategory === item.key
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <hr className="border-t-2 border-gray-200 mb-4" />

            {/* 필터바 */}
          <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
            {/* 좌측 필터: 지역 + 날짜 */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as GatheringLocation | 'ALL')}
                  className="appearance-none bg-white border-2 border-gray-100 rounded-xl px-4 py-3 pr-8 text-sm font-semibold text-gray-900"
                >
                  <option value="ALL">지역 전체</option>
                  <option value="건대입구">건대입구</option>
                  <option value="을지로3가">을지로3가</option>
                  <option value="신림">신림</option>
                  <option value="홍대입구">홍대입구</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                  ▼
                </div>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="appearance-none bg-white border-2 border-gray-100 rounded-xl px-4 py-3 pr-8 text-sm font-semibold text-gray-900"
                >
                  <option value="dateTime">날짜 전체</option>
                  <option value="registrationEnd">마감 임박</option>
                  <option value="participantCount">참여 인원</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                  ▼
                </div>
              </div>
            </div>

            {/* 우측: 정렬 토글 버튼 */}
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-semibold text-gray-900 "
            >
              <span className="text-lg leading-none">{sortOrder === 'asc' ? '↑' : '↓'}</span>
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
      </section>
    </main>
  );
}
