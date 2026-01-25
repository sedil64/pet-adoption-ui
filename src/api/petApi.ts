import { api } from './axiosConfig';
import type { Pet } from '../types/pet.types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getPets = async (): Promise<Pet[]> => {
  const response = await api.get<PaginatedResponse<Pet> | Pet[]>('/pets/');
  
  return Array.isArray(response.data) ? response.data : response.data.results;
};

export const getPetById = async (id: string): Promise<Pet> => {
  const response = await api.get<Pet>(`/pets/${id}/`);
  return response.data;
};

export const createPet = async (petFormData: FormData): Promise<Pet> => {
  const response = await api.post<Pet>('/pets/', petFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePet = async (id: number, petFormData: FormData): Promise<Pet> => {
  const response = await api.patch<Pet>(`/pets/${id}/`, petFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const deletePet = async (id: number): Promise<void> => {
  await api.delete(`/pets/${id}/`);
};