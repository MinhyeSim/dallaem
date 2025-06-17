'use client';

import Image from 'next/image';
import { Heart, Heart as HeartFilled } from 'lucide-react';
import { useState } from 'react';
import { Gathering } from '@/types/gatherings';
import { format } from 'date-fns';

interface Props {
    gathering: Gathering;
}

export default function GatheringCard({ gathering }: Props) {
  const {
    name,
    location,
    image,
    dateTime,
    registrationEnd,
    participantCount,
    capacity,
    canceledAt,
  } = gathering;

  console.log('[GatheringCard]', gathering); // 또는 gathering


  const [liked, setLiked] = useState(false);

  // 취소된 모임은 표시하지 않음 (추가 안전 장치)
  if (canceledAt) return null;

  const isClosed = participantCount >= capacity;
  const progress = Math.round((participantCount / capacity) * 100);

  const isToday =
    new Date(registrationEnd).toDateString() === new Date().toDateString();

  return (
    <div className="w-full flex gap-4 p-4 rounded-lg border hover:shadow transition bg-white">
      {/* 썸네일 */}
      <div className="relative w-40 h-28 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt="모임 이미지"
          fill
          className="object-cover rounded-md"
        />
        {isToday && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md shadow">
            오늘 마감
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-sm font-semibold">
          {name} | <span className="text-gray-500">{location}</span>
        </div>

        <div className="text-xs text-gray-600 flex gap-2">
          <span>{format(new Date(dateTime), 'M월 d일')}</span>
          <span>{format(new Date(dateTime), 'HH:mm')}</span>
        </div>

        <div className="text-xs text-gray-600 flex items-center gap-2">
          <span>
            {participantCount}/{capacity}
          </span>
          {isClosed && (
            <span className="text-orange-500">⚠️ 참여 마감</span>
          )}
        </div>

        {/* 인원 수 Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 찜하기 */}
      <button
        className="self-start mt-1"
        onClick={(e) => {
          e.stopPropagation();
          setLiked((prev) => !prev);
        }}
      >
        {liked ? (
          <HeartFilled className="w-5 h-5 text-orange-500 fill-orange-500" />
        ) : (
          <Heart className="w-5 h-5 text-gray-400 hover:text-orange-500" />
        )}
      </button>
    </div>
  );
}
