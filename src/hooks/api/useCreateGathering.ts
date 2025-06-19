import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from '@/lib/config';

interface CreateGatheringInput {
  type: string;
  name: string;
  location: string;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  image: File;
}

export const useCreateGathering = (token: string) => {
  const createGathering = async (data: CreateGatheringInput) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('name', data.name);
    formData.append('location', data.location);
    formData.append('dateTime', data.dateTime);
    formData.append('registrationEnd', data.registrationEnd);
    formData.append('capacity', String(data.capacity));
    formData.append('image', data.image); 
   

    const response = await axios.post(
      `${BASE_URL}/gatherings`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  return useMutation({ mutationFn: createGathering });
};
