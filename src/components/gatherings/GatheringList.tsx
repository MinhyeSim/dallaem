'use client';

import { useRouter } from 'next/navigation';
import { Gathering } from '@/types/gatherings';
import GatheringCard from './GatheringCard';

interface Props {
  gatherings: Gathering[];
}

export default function GatheringList({ gatherings }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {gatherings
        .filter((gathering) => gathering.canceledAt === null)
        .map((gathering) => (
          <div
            key={gathering.id}
            onClick={() => router.push(`/gatherings/${gathering.id}`)}
            className="cursor-pointer"
          >
            <GatheringCard gathering={gathering} />
          </div>
        ))}
    </div>
  );
}