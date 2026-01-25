import { api } from './axiosConfig';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface CreateAdoptionRequest {
  user: number;
  pet: number;
  notes?: string;
  status: string;
}

interface AdoptionResponse {
  id: number;
  user: number;
  pet: number;
  status: string;
  notes?: string;
  created_at: string;
}

export const createAdoptionRequest = async (data: CreateAdoptionRequest): Promise<AdoptionResponse> => {
  const response = await api.post<AdoptionResponse>('/adoption-requests/', data);
  return response.data;
};

export const getMyAdoptionRequests = async (): Promise<AdoptionResponse[]> => {
  const response = await api.get<PaginatedResponse<AdoptionResponse> | AdoptionResponse[]>('/adoption-requests/');
  return Array.isArray(response.data) ? response.data : response.data.results;
};

export const getAllAdoptionRequests = async (): Promise<AdoptionResponse[]> => {
  const response = await api.get<PaginatedResponse<AdoptionResponse> | AdoptionResponse[]>('/adoption-requests/');
  return Array.isArray(response.data) ? response.data : response.data.results;
};

interface UpdateRequestStatus {
  status: string;
  notes?: string;
}

export const updateAdoptionRequestStatus = async (id: number, data: UpdateRequestStatus): Promise<AdoptionResponse> => {
  const response = await api.patch<AdoptionResponse>(`/adoption-requests/${id}/`, data);
  return response.data;
};