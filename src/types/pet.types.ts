export type PetStatus = 'AVAILABLE' | 'ADOPTED';
export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  status: PetStatus;
  admission_date?: string;
  shelter: number;
  shelter_name?: string;
  photo?: string;
  description?: string | null;
}