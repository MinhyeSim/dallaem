'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Gathering } from '@/types/gatherings';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

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

  const [liked, setLiked] = useState(false);

  if (canceledAt) return null;

  const isClosed = participantCount >= capacity;
  const progress = Math.round((participantCount / capacity) * 100);
  const isConfirmed = participantCount >= 5;
  const isToday =
    new Date(registrationEnd).toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="w-full flex gap-4 p-4 rounded-xl border bg-white hover:shadow-xl transition-shadow duration-300 relative"
    >
      {/* 썸네일 */}
      <div className="relative w-40 h-28 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt="모임 이미지"
          fill
          className="object-cover rounded-md"
        />
        {isToday && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
            ⏰ 오늘 마감
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="text-sm font-semibold">
          {name}{' '}
          <span className="text-gray-500 font-normal">| {location}</span>
        </div>

        <div className="flex gap-2 mt-1">
          <span className="text-xs px-2 py-1 bg-black text-white rounded">
            {format(new Date(dateTime), 'M월 d일')}
          </span>
          <span className="text-xs px-2 py-1 bg-black text-white rounded">
            {format(new Date(dateTime), 'HH:mm')}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
          <span>👤 {participantCount}/{capacity}</span>
          {isConfirmed && (
            <span className="text-orange-500 border border-orange-500 rounded px-2 py-0.5 text-[11px] font-medium">
              ✔ 개설확정
            </span>
          )}
        </div>

        <div className="w-full bg-gray-100 h-2 mt-1 rounded overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${
              isClosed ? 'bg-orange-700' : 'bg-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 찜하기 */}
      <button
        className="absolute top-3 right-3 transition-transform duration-300"
        onClick={(e) => {
          e.stopPropagation();
          setLiked((prev) => !prev);
        }}
      >
        <Heart
          className={`w-5 h-5 ${
            liked
              ? 'text-orange-500 fill-orange-500 scale-110'
              : 'text-gray-400 hover:text-orange-500'
          } transition-all duration-300`}
        />
      </button>
    </motion.div>
  );
}
