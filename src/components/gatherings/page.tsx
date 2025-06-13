import { fetchGatherings } from '@/lib/api';
import GatheringList from '@/components/gatherings/GatheringList';

export default async function GatheringsPage() {
  const gatherings = await fetchGatherings();

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">모임 목록</h1>
      <GatheringList gatherings={gatherings} />
    </main>
  );
}
