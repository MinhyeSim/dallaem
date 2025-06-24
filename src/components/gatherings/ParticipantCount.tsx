'use client';

interface Props {
  currentCount: number;
  capacity: number;
}

export default function ParticipantCount({ currentCount, capacity }: Props) {
  return (
    <p className="text-sm text-gray-700 mb-4">
      참여 인원: {currentCount} / {capacity}
    </p>
  );
}
