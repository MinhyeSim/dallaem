
export type GatheringType = 'DALLAEMFIT' | 'OFFICE_STRETCHING' | 'MINDFULNESS' | 'WORKATION';
export type GatheringLocation = '건대입구' | '을지로3가' | '신림' | '홍대입구';
export type SortBy = 'dateTime' | 'registrationEnd' | 'participantCount';
export type SortOrder = 'asc' | 'desc';

export interface Gathering {
  teamId: string;
  id: number;
  type: GatheringType;
  name: string;
  dateTime: string;
  registrationEnd: string;
  location: GatheringLocation;
  participantCount: number;
  capacity: number;
  image: string;
  createdBy: number;
  canceledAt: string | null;
}
