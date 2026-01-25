import { api } from "./axiosConfig";

export interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export const getShelters = async (): Promise<Shelter[]> => {
  const response = await api.get("/api/shelters/");
  return response.data;
};
