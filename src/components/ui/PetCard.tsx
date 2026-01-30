import { Link } from 'react-router-dom';
import type { Pet } from '../../types/pet.types';

interface PetCardProps {
  pet: Pet;
}


const PET_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  ADOPTED: 'Adoptado',
};

export const PetCard = ({ pet }: PetCardProps) => {
  const defaultImage =
    'https://placehold.co/400x300/e2e8f0/475569?text=Sin+Foto';

  const isAvailable = pet.status === 'AVAILABLE';
  const statusLabel =
    PET_STATUS_LABELS[pet.status] ?? pet.status;

  return (
    <Link
      to={`/mascotas/${pet.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
    >
      <div className="aspect-w-4 aspect-h-3 h-48 w-full overflow-hidden bg-gray-100 relative">
        <img
          src={pet.photo || defaultImage}
          alt={`Foto de ${pet.name}`}
          className="w-full h-full object-cover"
        />

        <span
          className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium border ${
            isAvailable
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {pet.name}
        </h3>

        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p>
            <span className="font-medium text-gray-700">Especie:</span>{' '}
            {pet.species}
          </p>
          <p>
            <span className="font-medium text-gray-700">Raza:</span>{' '}
            {pet.breed}
          </p>
          <p>
            <span className="font-medium text-gray-700">Edad:</span>{' '}
            {pet.age} años
          </p>
        </div>
        {pet.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {pet.description}
          </p>
        )}

        <span className="text-blue-600 font-medium text-sm hover:underline mt-auto">
          Ver detalles →
        </span>
      </div>
    </Link>
  );
};