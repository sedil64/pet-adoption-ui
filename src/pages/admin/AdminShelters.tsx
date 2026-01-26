import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShelters, deleteShelter } from '../../api/shelters.api';

interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  is_active: boolean;
}

export const AdminShelters = () => {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShelters = async () => {
    try {
      setLoading(true);
      const data = await getShelters();
      setShelters(data);
    } catch {
      setError('Error al cargar los refugios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      '¿Estás seguro de eliminar este refugio? Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    try {
      await deleteShelter(id);
      fetchShelters();
    } catch {
      alert('No se pudo eliminar el refugio.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando refugios...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Refugios
          </h1>
          <p className="text-gray-600 text-sm">
            Administra los refugios registrados en la plataforma
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/refugios/nuevo')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
        >
          + Agregar refugio
        </button>
      </div>

      {shelters.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No hay refugios registrados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {shelters.map((shelter) => (
                <tr key={shelter.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {shelter.name}
                  </td>
                  <td className="px-4 py-3">{shelter.phone}</td>
                  <td className="px-4 py-3">{shelter.email || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    {shelter.is_active ? (
                      <span className="text-green-600 font-medium">
                        Activo
                      </span>
                    ) : (
                      <span className="text-gray-400">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/refugios/${shelter.id}/editar`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(shelter.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
