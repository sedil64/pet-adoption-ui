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

/**
 * LISTAR REFUGIOS (público)
 */
export const getShelters = async (): Promise<Shelter[]> => {
  const res = await api.get<PaginatedResponse<Shelter> | Shelter[]>('/shelters/');
  return Array.isArray(res.data) ? res.data : res.data.results;
};

/**
 * OBTENER REFUGIO POR ID
 */
export const getShelterById = async (id: number): Promise<Shelter> => {
  const res = await api.get<Shelter>(`/shelters/${id}/`);
  return res.data;
};

/**
 * CREAR REFUGIO (admin)
 */
export const createShelter = async (data: FormData): Promise<Shelter> => {
  const res = await api.post<Shelter>('/shelters/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/**
 * ACTUALIZAR REFUGIO (admin)
 */
export const updateShelter = async (
  id: number,
  data: FormData
): Promise<Shelter> => {
  const res = await api.patch<Shelter>(`/shelters/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/**
 * ELIMINAR REFUGIO (admin)
 */
export const deleteShelter = async (id: number): Promise<void> => {
  await api.delete(`/shelters/${id}/`);
};