import { Gathering } from '../types/gatherings';

export async function fetchGatherings(): Promise<Gathering[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/gatherings`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('모임 목록을 불러오지 못했습니다.');

  const data: Gathering[] = await res.json();

  // 취소된 모임 제외
  return data.filter((gathering) => gathering.canceledAt === null).slice(0, 10);
}
