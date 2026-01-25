export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  status: string;
  admission_date?: string;
  shelter: number;
  shelter_name?: string;
  photo?: string;
}