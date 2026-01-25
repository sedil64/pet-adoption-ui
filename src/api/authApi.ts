import { api } from './axiosConfig';
import type { User } from '../types/auth.types';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export const loginRequest = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login/', credentials);
  return response.data;
};

interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await api.post('/auth/change-password/', data);
};

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData): Promise<void> => {
  await api.post('/auth/register/', data);
};