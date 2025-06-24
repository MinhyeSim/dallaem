'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import ClientFooterSection from './shared/ClientFooterSection';
import LikeButton from './shared/LikeButton';
import { Gathering } from '@/types/gatherings';

interface Props {
  gathering: Gathering;
}

export default function ClientGatheringDetail({ gathering }: Props) {
  const {
    id,
    name,
    dateTime,
    location,
    capacity,
    image,
    createdBy,
    registrationEnd,
  } = gathering;

  const [participantCount, setParticipantCount] = useState(gathering.participantCount);

  const isConfirmed = participantCount >= 5;
  const isToday =
    new Date(registrationEnd).toDateString() === new Date().toDateString();
  const formattedDate = format(new Date(dateTime), 'M월 d일');
  const formattedTime = format(new Date(dateTime), 'HH:mm');

  return (
    <main className="min-h-screen bg-gray-100 px-4">
      <section className="max-w-5xl mx-auto bg-gray-50 rounded-t-xl p-12 -mt-2">
        {/* 상단 이미지 & 정보 */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[480px] h-[280px] rounded-2xl border-2 border-gray-200 bg-white p-6 relative">
            <Image src={image} alt="모임 이미지" fill className="object-cover" />
            {isToday && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full z-10">
                🕒 오늘 {format(new Date(registrationEnd), 'H시')} 마감
              </div>
            )}
          </div>
          <div className="w-full lg:w-[480px] h-[280px] rounded-2xl border-2 border-gray-200 bg-white p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{name}</h2>
                <p className="text-sm text-gray-500 mt-1">{location}</p>
              </div>
              <LikeButton />
            </div>
            <div className="flex gap-2 mb-4">
              <span className="bg-gray-900 text-white text-xs px-2 py-1.5 rounded-md">
                {formattedDate}
              </span>
              <span className="bg-gray-900 text-orange-500 text-xs px-2 py-1.5 rounded-md">
                {formattedTime}
              </span>
            </div>
            <hr className="border-dashed border-t border-gray-200 mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">
                모집 정원 {participantCount}명
              </span>
              {isConfirmed && (
                <Image src="/opening_confirmed.svg" alt="개설확정" width={80} height={80} />
              )}
            </div>
            <div className="flex items-center -space-x-2 mb-2">
              {Array.from({ length: participantCount })
                .slice(0, 5)
                .map((_, i) => (
                  <Image
                    key={i}
                    src="/profile.svg"
                    alt="참여자"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white"
                  />
                ))}
              {participantCount > 5 && (
                <span className="ml-3 text-sm text-gray-600">
                  {participantCount - 5}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
              <div
                className="bg-orange-500 h-full transition-all duration-700"
                style={{ width: `${(participantCount / capacity) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>최소인원 5명</span>
              <span>최대인원 {capacity}명</span>
            </div>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <section className="mt-10">
          <div className="bg-white border-t-3 border-gray-200 p-8 min-h-[240px]">
            <h3 className="text-lg font-semibold mb-4">
              이용자들은 이 프로그램을 이렇게 느꼈어요!
            </h3>
            <p className="text-sm text-gray-400 text-center py-20">
              아직 리뷰가 없어요
            </p>
          </div>
        </section>

        {/* 하단 버튼 */}
        <ClientFooterSection
          gatheringId={String(id)}
          createdBy={createdBy}
          participantCount={participantCount}
          capacity={capacity}
          setCurrentCount={setParticipantCount}
        />
      </section>
    </main>
  );
}