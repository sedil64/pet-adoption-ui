import { useEffect, useState } from 'react';
import { getPets } from '../../api/petApi';
import type { Pet } from '../../types/pet.types';
import { PetCard } from '../../components/ui/PetCard';

export const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({
    status: 'AVAILABLE',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchText || undefined,
      }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPets(filters);
        setPets(data);
      } catch {
        setError(
          'Ocurrió un error al cargar las mascotas. Intenta de nuevo más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [filters]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Mascotas en adopción
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Cada uno de ellos tiene una historia y está esperando un hogar donde
          recibir amor, cuidado y una segunda oportunidad.
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <input
          type="text"
          value={searchText}
          placeholder="Buscar por nombre, especie o raza"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.status || ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value || undefined,
            }))
          }
        >
          <option value="">Todas</option>
          <option value="AVAILABLE">Disponibles</option>
          <option value="ADOPTED">Adoptadas</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <span className="text-gray-500 font-medium">
            Cargando mascotas...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-center">
          {error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        pets.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white rounded-lg border border-gray-100">
            No hay mascotas disponibles con estos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )
      )}
    </div>
  );
};