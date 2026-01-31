import { api } from './axiosConfig';

export interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  photo: string | null;
  pets_count: number;
  is_active: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getShelters = async (): Promise<Shelter[]> => {
  const res = await api.get<PaginatedResponse<Shelter> | Shelter[]>('/shelters/');
  return Array.isArray(res.data) ? res.data : res.data.results;
};