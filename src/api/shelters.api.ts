import { api } from "./axiosConfig";
import type { Shelter } from "../types/shelter.types";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Normaliza refugio (photo nunca será null)
 */
const normalizeShelter = (shelter: any): Shelter => ({
  ...shelter,
  photo: shelter.photo ?? "",
});

/**
 * LISTAR REFUGIOS (público)
 */
export const getShelters = async (): Promise<Shelter[]> => {
  const res = await api.get<PaginatedResponse<any> | any[]>("/shelters/");
  const data = Array.isArray(res.data) ? res.data : res.data.results;

  return data.map(normalizeShelter);
};

/**
 * OBTENER REFUGIO POR ID
 */
export const getShelterById = async (id: number): Promise<Shelter> => {
  const res = await api.get<any>(`/shelters/${id}/`);
  return normalizeShelter(res.data);
};

/**
 * CREAR REFUGIO (admin)
 */
export const createShelter = async (data: FormData): Promise<Shelter> => {
  const res = await api.post<any>("/shelters/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeShelter(res.data);
};

/**
 * ACTUALIZAR REFUGIO (admin)
 */
export const updateShelter = async (
  id: number,
  data: FormData
): Promise<Shelter> => {
  const res = await api.patch<any>(`/shelters/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeShelter(res.data);
};

/**
 * ELIMINAR REFUGIO (admin)
 */
export const deleteShelter = async (id: number): Promise<void> => {
  await api.delete(`/shelters/${id}/`);
};