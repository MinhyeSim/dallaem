import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Gathering } from '@/types/gatherings';

const PAGE_SIZE = 10;

interface FetchParams {
  pageParam?: number; 
  type?: string;
  location?: string;
  sortBy?: string;
  sortOrder?: string;
}

export async function fetchGatherings({
  pageParam = 0,
  type,
  location,
  sortBy = 'dateTime',
  sortOrder = 'asc',
}: FetchParams): Promise<Gathering[]> {
  const offset = pageParam * PAGE_SIZE;

  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: PAGE_SIZE.toString(),
    sortBy,
    sortOrder,
  });

  if (type) params.append('type', type);
  if (location) params.append('location', location);

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URI}/gatherings?${params.toString()}`
  );

  return res.data;
}

export function useInfiniteGatherings({
  type,
  location,
  sortBy = 'dateTime',
  sortOrder = 'asc',
}: {
  type?: string;
  location?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  return useInfiniteQuery<Gathering[]>({
    queryKey: ['gatherings', type, location, sortBy, sortOrder],
    queryFn: ({ pageParam }) =>
      fetchGatherings({
        pageParam: pageParam as number,
        type,
        location,
        sortBy,
        sortOrder,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length, 
  });
}
