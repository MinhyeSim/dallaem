'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Gathering } from '@/types/gatherings';

interface Props {
  gathering: Gathering;
}

export default function GatheringCard({ gathering }: Props) {
  const {
    id,
    name,
    location,
    image,
    dateTime,
    registrationEnd,
    participantCount: initialCount,
    capacity,
  } = gathering;

  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const [currentCount, setCurrentCount] = useState(initialCount);

  const isClosed = currentCount >= capacity;
  const isConfirmed = currentCount >= 5;
  const isToday =
    new Date(registrationEnd).toDateString() === new Date().toDateString();
  const isExpired = new Date(registrationEnd) < new Date();

  const progress = Math.round((currentCount / capacity) * 100);

  const handleClick = () => {
    if (!isExpired) router.push(`/gatherings/${id}`);
  };

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/gatherings/${id}/join`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );     
      setCurrentCount((c) => c + 1);
 
    } catch (err) {
      console.error('참여 실패:', err);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative flex bg-white rounded-2xl shadow-sm border border-gray-200 pr-4 pl-0 cursor-pointer hover:shadow-md transition"
    >
      {/* 썸네일 */}
      <div className="relative flex-shrink-0 w-60 h-36 overflow-hidden rounded-l-2xl mr-4">
        <Image src={image} alt={name} fill className="object-cover" />
        {isToday && !isExpired && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow">
            <Image src="/clock.svg" alt="오늘 마감" width={12} height={12} />
            <span>오늘 {format(new Date(registrationEnd), 'H시')} 마감</span>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col justify-center flex-1 py-1 space-y-4">
        <div>
          <div className="text-sm font-semibold text-gray-800">
            {name}
            <span className="ml-2 text-gray-500 font-normal text-xs">
              | {location}
            </span>
          </div>

          <div className="flex gap-2 mt-1">
            <span className="text-xs px-2 py-1 bg-gray-800 text-white rounded">
              {format(new Date(dateTime), 'M월 d일')}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-800 text-orange-500 rounded">
              {format(new Date(dateTime), 'HH:mm')}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <span>👤 {currentCount}/{capacity}</span>
             {isConfirmed && (
              <Image
                src="/opening_confirmed.svg"
                alt="개설확정"
                width={80}
                height={80}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isClosed ? 'bg-orange-700' : 'bg-orange-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={isClosed}
            className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:opacity-80 transition"
          >
            <span>join now</span>
            <Image
              src="/join_arrow.svg"
              alt="화살표"
              width={16}
              height={16}
              className="object-contain"
            />
          </button>
        </div>
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setLiked((prev) => !prev);
        }}
        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center"
        whileTap={{ scale: 0.8 }}
        animate={liked ? { scale: 1.2 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        aria-label={liked ? '저장됨' : '찜하기'}
      >
        <Image
          src={liked ? '/saved.svg' : '/not_saved.svg'}
          alt={liked ? '저장됨' : '찜하기'}
          width={40}
          height={40}
          className="object-contain"
        />
      </motion.button>

      {isExpired && (
        <div className="absolute inset-0 bg-black/70 rounded-2xl z-10 flex flex-col justify-center items-center text-white text-sm">
          <span>마감된 챌린지예요</span>
          <span className="mt-1 text-orange-500">다음 기회에 만나요 🙏</span>
        </div>
      )}
    </motion.div>
  );
}
