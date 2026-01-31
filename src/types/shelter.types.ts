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