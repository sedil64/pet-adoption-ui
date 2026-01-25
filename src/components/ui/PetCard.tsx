import { Link } from 'react-router-dom';
import type { Pet } from '../../types/pet.types';

interface PetCardProps {
  pet: Pet;
}

export const PetCard = ({ pet }: PetCardProps) => {
  const defaultImage = 'https://placehold.co/400x300/e2e8f0/475569?text=Sin+Foto';

  return (
    <Link 
      to={`/mascotas/${pet.id}`} 
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
    >
      <div className="aspect-w-4 aspect-h-3 h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={pet.photo || defaultImage} 
          alt={`Foto de ${pet.name}`} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
            pet.status.toLowerCase() === 'available' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            {pet.status === 'Available' ? 'Disponible' : pet.status}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1 mb-4 flex-1">
          <p><span className="font-medium text-gray-700">Especie:</span> {pet.species}</p>
          <p><span className="font-medium text-gray-700">Raza:</span> {pet.breed}</p>
          <p><span className="font-medium text-gray-700">Edad:</span> {pet.age} años</p>
        </div>

        <span className="text-blue-600 font-medium text-sm hover:underline mt-auto">
          Ver detalles →
        </span>
      </div>
    </Link>
  );
};