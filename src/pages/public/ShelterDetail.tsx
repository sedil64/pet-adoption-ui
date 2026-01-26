import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPets } from '../../api/petApi';
import { getShelterById } from '../../api/shelters.api';
import type { Pet } from '../../types/pet.types';
import { PetCard } from '../../components/ui/PetCard';

export const ShelterDetail = () => {
  const { id } = useParams();
  const shelterId = Number(id);

  const [pets, setPets] = useState<Pet[]>([]);
  const [shelter, setShelter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShelterAndPets = async () => {
      try {
        setLoading(true);

        const [shelterData, petsData] = await Promise.all([
          getShelterById(shelterId),
          getPets({ shelter: shelterId })
        ]);

        setShelter(shelterData);
        setPets(petsData);
      } catch (err) {
        setError('Ocurrió un error al cargar el refugio.');
      } finally {
        setLoading(false);
      }
    };

    fetchShelterAndPets();
  }, [shelterId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 font-medium">Cargando refugio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-center">
        {error}
      </div>
    );
  }

  if (!shelter) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {shelter.name}
        </h1>
        <p className="text-gray-600 mt-2">{shelter.address}</p>
        <p className="text-gray-600">{shelter.phone}</p>
      </div>

      {pets.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-100">
          Este refugio no tiene mascotas disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
};
