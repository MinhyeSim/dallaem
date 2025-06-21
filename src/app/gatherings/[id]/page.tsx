import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/config';
import ClientFooterSection from '@/components/gatherings/shared/ClientFooterSection';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';


export const metadata: Metadata = {
  title: '모임 상세',
};

interface JwtPayload {
  userId: number;
  teamId: string;
}


export const dynamic = 'force-dynamic';

async function getGathering(id: string) {
  const res = await fetch(`${BASE_URL}/gatherings/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}


export default async function GatheringDetailPage({ params }: { params: Promise<{ id : string }>}) {
  // const id = params.id;
  const { id } = await params;
  const gathering = await getGathering(id); 
  console.log('🧾 gathering response:', gathering);
  if (!gathering) return notFound();

  const {
    name,
    dateTime,
    location,
    participantCount,
    capacity,
    image,
    createdBy,
    registrationEnd,
  } = gathering;

  const isConfirmed = participantCount >= 5;
  const isToday =
    new Date(registrationEnd).toDateString() === new Date().toDateString();
  const formattedDate = format(new Date(dateTime), 'M월 d일');
  const formattedTime = format(new Date(dateTime), 'HH:mm');

  const dummyProfiles = ['/profile.svg', '/profile.svg', '/profile.svg', '/profile.svg', '/profile.svg'];
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;



  let currentUserId: number | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      currentUserId = decoded.userId;
    } catch (e) {
      console.error('❌ JWT 디코딩 실패:', e);
    }
  }

  const isUserJoined =
    currentUserId !== null &&
    Array.isArray(gathering.participants) &&
    gathering.participants.includes(currentUserId);



  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-32">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-stretch max-w-5xl mx-auto">
        {/* 좌측: 이미지 (고정 사이즈) */}
        <div className="relative w-full lg:w-[500px] h-[360px] rounded-2xl overflow-hidden shrink-0">
          <Image
            src={image}
            alt="모임 이미지"
            fill
            className="object-cover"
          />
          {isToday && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow flex items-center gap-1 z-10">
              🕒 오늘 {format(new Date(registrationEnd), 'H시')} 마감
            </div>
          )}
        </div>


        {/* 우측: 정보 카드 (고정 사이즈) */}
        <div className="w-full lg:w-[600px] h-[360px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          {/* 상단: 제목 + 장소 + 찜하기 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-500 mt-1">{location}</p>
            </div>
            {/* 찜하기 버튼 (하트 아이콘) */}
            <button className="border border-gray-300 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                2 6.42 3.42 5 5.5 5c1.54 0 3.04.99 
                3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 
                18.58 5 20 6.42 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* 날짜 / 시간 */}
          <div className="flex gap-2 mb-4">
            <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-md">
              {formattedDate}
            </span>
            <span className="bg-gray-900 text-orange-500 text-xs px-3 py-1 rounded-md">
              {formattedTime}
            </span>
          </div>

          {/* 구분선 */}
          <hr className="border-dashed border-t border-gray-200 mb-4" />

          {/* 모집 정원 + 참여자 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">모집 정원 {participantCount}명</span>

            {isConfirmed && (
              <span className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                <span className="text-xl">✔</span> 개설확정
              </span>
            )}
          </div>

          {/* 참여자 이미지 */}
          <div className="flex items-center -space-x-2 mb-2">
            {dummyProfiles.slice(0, 5).map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="참여자"
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
            ))}
            {participantCount > 5 && (
              <span className="ml-3 text-sm text-gray-600">+{participantCount - 5}</span>
            )}
          </div>

          {/* 진행 바 */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
            <div
              className="bg-orange-500 h-full transition-all duration-700"
              style={{ width: `${(participantCount / capacity) * 100}%` }}
            />
          </div>

          {/* 최소/최대 인원 */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>최소인원 5명</span>
            <span>최대인원 {capacity}명</span>
          </div>
        </div>
      </div>

      {/* 리뷰 영역 */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold mb-4">
          이용자들은 이 프로그램을 이렇게 느꼈어요!
        </h3>

        {/* 리뷰 없는 상태 */}
        <p className="text-sm text-gray-400 text-center py-20">
          아직 리뷰가 없어요
        </p>
      </section>

      {/* 하단 고정 버튼 */}
        <ClientFooterSection
          gatheringId={id}
          createdBy={createdBy}
          participantCount={participantCount}
          capacity={capacity}
        />
    </div>
  );
}