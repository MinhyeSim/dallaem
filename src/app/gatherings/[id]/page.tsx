import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/config';
import ClientGatheringDetail from '@/components/gatherings/ClientGatheringDetail';

export const metadata: Metadata = {
  title: '모임 상세',
};

export const dynamic = 'force-dynamic';

async function getGathering(id: string) {
  const res = await fetch(`${BASE_URL}/gatherings/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function GatheringDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gathering = await getGathering(id);
  if (!gathering) return notFound();

  return <ClientGatheringDetail gathering={gathering} />;
}
