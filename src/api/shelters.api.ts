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

export const createShelter = async (data: FormData) => {
  const response = await api.post('/shelters/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateShelter = async (id: number, data: FormData) => {
  const response = await api.patch(`/shelters/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteShelter = async (id: number) => {
  await api.delete(`/shelters/${id}/`);
};