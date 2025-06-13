'use client';

import { Gathering } from '../../types/gatherings';
import { useRouter } from 'next/navigation';

export default function GatheringCard({ gathering }: { gathering: Gathering }) {
  const router = useRouter();

  const {
    id,
    name,
    image,
    location,
    dateTime,
    participantCount,
    capacity,
  } = gathering;

  const date = new Date(dateTime).toLocaleDateString();

  const progress = Math.floor((participantCount / capacity) * 100);
  const isFull = participantCount >= capacity;

  return (
    <div
      onClick={() => router.push(`/gatherings/${id}`)}
      className="cursor-pointer border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-500">{location} · {date}</p>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-orange-400'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">{participantCount} / {capacity} 명</p>
      </div>
    </div>
  );
}
