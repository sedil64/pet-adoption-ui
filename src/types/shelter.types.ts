export interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  photo: string;       
  pets_count: number;
  is_active: boolean;
}