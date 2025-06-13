import { Gathering } from '../../types/gatherings';
import GatheringCard from './GatheringCard';

export default function GatheringList({ gatherings }: { gatherings: Gathering[] }) {
  if (gatherings.length === 0) {
    return <p className="text-center text-gray-500 mt-10">모임이 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {gatherings.map((gathering) => (
        <GatheringCard key={gathering.id} gathering={gathering} />
      ))}
    </div>
  );
}
