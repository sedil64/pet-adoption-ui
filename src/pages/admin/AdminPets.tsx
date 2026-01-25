import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPets, deletePet } from '../../api/petApi';
import type { Pet } from '../../types/pet.types';

export const AdminPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data);
      } catch (err) {
        alert('Error al cargar las mascotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${name}? Esta acción no se puede deshacer.`)) return;

    try {
      await deletePet(id);
      setPets(pets.filter(pet => pet.id !== id));
    } catch (err) {
      alert('Error al eliminar la mascota.');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando mascotas...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Mascotas</h1>
          <p className="text-gray-600 mt-2">Administra el inventario completo de mascotas.</p>
        </div>
        <Link 
          to="/admin/mascotas/nueva" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          + Agregar Mascota
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{pet.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                  <div className="text-xs text-gray-500">{pet.species} - {pet.breed}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pet.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pet.status === 'Available' ? 'Disponible' : pet.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <Link to={`/admin/mascotas/editar/${pet.id}`} className="text-blue-600 hover:text-blue-900">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(pet.id, pet.name)} className="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};