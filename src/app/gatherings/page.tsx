import { fetchGatherings } from '@/lib/api';
import GatheringList from '@/components/gatherings/GatheringList';
import CreateButton from '@/components/gatherings/CreateButton'; // 로그인 시 버튼 노출용 클라이언트 컴포넌트

export default async function GatheringsPage() {
  const gatherings = await fetchGatherings();

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">모임 목록</h1>
        <CreateButton />
      </div>

      {gatherings.length > 0 ? (
        <GatheringList gatherings={gatherings} />
      ) : (
        <div className="border p-6 text-center text-gray-600 rounded-md">
          현재 생성된 모임이 없습니다.
        </div>
      )}
    </div>
  );
}
