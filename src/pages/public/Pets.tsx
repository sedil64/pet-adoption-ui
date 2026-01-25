import { useEffect, useState } from 'react';
import { getPets } from '../../api/petApi';
import type { Pet } from '../../types/pet.types';
import { PetCard } from '../../components/ui/PetCard';

export const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await getPets();
        setPets(data);
      } catch (err) {
        setError('Ocurrió un error al cargar las mascotas. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 font-medium">Cargando mascotas...</span>
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mascotas en adopción</h1>
        <p className="text-gray-600 mt-2">
          Conoce a nuestros amigos que están buscando un hogar lleno de amor.
        </p>
      </div>

      {pets.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-100">
          No hay mascotas disponibles en este momento.
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