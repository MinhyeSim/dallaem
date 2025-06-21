'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Gathering } from '@/types/gatherings';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

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
    participantCount,
    capacity,
    canceledAt,
  } = gathering;

  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const isClosed = participantCount >= capacity;
  const isConfirmed = participantCount >= 5;
  const isToday =
    new Date(registrationEnd).toDateString() === new Date().toDateString();
  const isExpired = new Date(registrationEnd) < new Date();
  const progress = Math.round((participantCount / capacity) * 100);

  const handleClick = () => {
    if (isExpired) return;
    router.push(`/gatherings/${id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className=" flex bg-white rounded-2xl shadow-sm border border-gray-200 pr-4 pl-0 relative cursor-pointer hover:shadow-md transition"
    >
      {/* 썸네일 */}
      <div className="relative flex-shrink-0 w-60 h-36 overflow-hidden rounded-l-2xl mr-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        {isToday && !isExpired && (
      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow">
        <Image
          src="/clock.svg"
          alt="오늘 마감"
          width={12}
          height={12}
        />
        <span>오늘 21시 마감</span>
      </div>
    )}
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col justify-center flex-1 py-1 space-y-4">
        <div>
          <div className="text-sm font-semibold text-gray-800">
            {name}
            <span className="ml-2 text-gray-500 font-normal text-xs">| {location}</span>
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
            <span>👤 {participantCount}/{capacity}</span>
            {isConfirmed && (
              <span className="text-orange-500 bg-orange-50 border border-orange-200 rounded px-2 py-0.5 font-medium">
                ✔ 개설확정
              </span>
            )}
          </div>
        </div>

         <div className="flex items-center gap-4 mt-2">
           {/* 1) 진행 바 */}
           <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
             <div
               className={`h-full rounded-full transition-all duration-500 ${
                 isClosed ? 'bg-orange-700' : 'bg-orange-500'
               }`}
               style={{ width: `${progress}%` }}
             />
           </div>
        
           {/* 2) join now 버튼 */}
           <button
             onClick={(e) => {
               e.stopPropagation();
               router.push(`/gatherings/${id}`);
             }}
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

      {/* 찜하기 버튼 */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setLiked((prev) => !prev);
        }}
        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center"
        whileTap={{ scale: 0.8 }}
        animate={liked ? { scale: 1.2 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Image
          src={liked ? '/saved.svg' : '/not_saved.svg'}
          alt="찜하기"
          width={28}
          height={28}
          className="object-contain"
        />
      </motion.button>

      {/* 마감 상태 */}
      {isExpired && (
        <div className="absolute inset-0 bg-black/70 rounded-2xl z-10 flex flex-col justify-center items-center text-white text-sm">
          <span>마감된 챌린지예요</span>
          <span className="mt-1 text-orange-500">다음 기회에 만나요 🙏</span>
        </div>
      )}
    </motion.div>
  );
}
