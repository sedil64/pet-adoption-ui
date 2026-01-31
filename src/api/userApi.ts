import { api } from './axiosConfig';
import type { User } from '../types/auth.types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<PaginatedResponse<User> | User[]>(
    '/admin/users/',
    {
      params: {
        page_size: 1000, // 👈 CAMBIO CLAVE
      },
    }
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.results;
};

interface UpdateUserRole {
  is_staff: boolean;
}

export const updateUserRole = async (
  userId: number,
  data: UpdateUserRole
): Promise<User> => {
  const response = await api.patch<User>(
    `/admin/users/${userId}/`,
    data
  );
  return response.data;
};