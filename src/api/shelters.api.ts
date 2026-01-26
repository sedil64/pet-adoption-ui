import { api } from './axiosConfig';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getShelters = async () => {
  const res = await api.get<PaginatedResponse<any> | any[]>('/shelters/');
  return Array.isArray(res.data) ? res.data : res.data.results;
};

export const getShelterById = (id: number) =>
  api.get(`/shelters/${id}/`).then(res => res.data);
