import { api } from './axiosConfig';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateAdoptionRequest {
  pet: number;
  notes?: string;
  status?: string; 
}

export interface AdoptionResponse {
  id: number;
  user: number; 
  pet: number;  
  status: string;
  notes?: string;
  request_date: string; 
  user_name: string;
  user_email: string;
  pet_name: string;
  pet_species: string;
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

export const approveAdoptionRequest = async (id: number) => {
  console.log('APPROVING ID:', id);
  const { data } = await api.post(`/adoption-requests/${id}/approve/`);
  return data;
};
export const rejectAdoptionRequest = async (id: number) => {
  const { data } = await api.post(`/adoption-requests/${id}/reject/`);
  return data;
};

export const getAdoptionRequestById = async (id: number) => {
  const { data } = await api.get(`/adoption-requests/${id}/`);
  return data;
};