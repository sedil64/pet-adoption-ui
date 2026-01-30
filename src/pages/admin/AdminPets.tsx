import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPets, deletePet } from '../../api/petApi';
import type { Pet } from '../../types/pet.types';

const PET_STATUS_CONFIG: Record<
  'AVAILABLE' | 'ADOPTED',
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: 'Disponible',
    className: 'bg-green-100 text-green-800',
  },
  ADOPTED: {
    label: 'Adoptada',
    className: 'bg-gray-100 text-gray-800',
  },
};

export const AdminPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data);
      } catch {
        alert('Error al cargar las mascotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleDelete = async (pet: Pet) => {
    if (pet.status === 'ADOPTED') {
      alert('No se puede eliminar una mascota ya adoptada.');
      return;
    }

    if (
      !window.confirm(
        `¿Estás seguro de eliminar a ${pet.name}? Esta acción no se puede deshacer.`
      )
    )
      return;

    try {
      await deletePet(pet.id);
      setPets((prev) => prev.filter((p) => p.id !== pet.id));
    } catch {
      alert('Error al eliminar la mascota.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Cargando mascotas...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Mascotas
          </h1>
          <p className="text-gray-600 mt-2">
            Administra el inventario completo de mascotas.
          </p>
        </div>

        <Link
          to="/admin/mascotas/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
        >
          + Agregar Mascota
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mascota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {pets.map((pet) => {
              const statusConfig = PET_STATUS_CONFIG[pet.status];

              return (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    #{pet.id}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {pet.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pet.species} – {pet.breed}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                    <Link
                      to={`/admin/mascotas/editar/${pet.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </Link>

                    {pet.status === 'AVAILABLE' && (
                      <button
                        onClick={() => handleDelete(pet)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};