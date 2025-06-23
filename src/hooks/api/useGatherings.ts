import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/axios';
import { Gathering, GatheringType, GatheringLocation, SortBy, SortOrder } from '@/types/gatherings';

interface UseGatheringsParams {
  type?: GatheringType;
  location?: GatheringLocation;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export function useGatherings(params: UseGatheringsParams) {
  return useQuery({
    queryKey: ['gatherings', params],
    queryFn: async () => {
      const response = await apiClient.get<Gathering[]>('/gatherings', { params });
      return response.data;
    },
  });
}
