'use client';

import { GatheringType } from '@/types/gatherings';

interface FilterTabsProps {
  selectedType: GatheringType | 'ALL';
  onChange: (type: GatheringType | 'ALL') => void;
}

const TABS: (GatheringType | 'ALL')[] = [
  'ALL',
  'DALLAEMFIT',
  'OFFICE_STRETCHING',
  'MINDFULNESS',
  'WORKATION',
];

const typeLabels: Record<GatheringType | 'ALL', string> = {
  ALL: '전체',
  DALLAEMFIT: '달램핏',
  OFFICE_STRETCHING: '오피스 스트레칭',
  MINDFULNESS: '마인드풀니스',
  WORKATION: '워케이션',
};

export default function FilterTabs({ selectedType, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 mb-4">
      {TABS.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            selectedType === type
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
        >
          {typeLabels[type]}
        </button>
      ))}
    </div>
  );
}
