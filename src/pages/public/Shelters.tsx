import { useEffect, useState } from 'react';
import { getShelters } from '../../api/shelters.api';
import { Link } from 'react-router-dom';

interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
  photo?: string;
}

export const Shelters = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        setLoading(true);
        const data = await getShelters();
        setShelters(data);
      } catch (err) {
        setError('Ocurrió un error al cargar los refugios.');
      } finally {
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 font-medium">
          Cargando refugios...
        </span>
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
        <h1 className="text-3xl font-bold text-gray-800">
          Refugios
        </h1>
        <p className="text-gray-600 mt-2">
          Conoce los refugios que trabajan con nosotros.
        </p>
      </div>

      {shelters.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-100">
          No hay refugios registrados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shelters.map((shelter) => (
            <div
              key={shelter.id}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {shelter.photo && (
                <img
                  src={shelter.photo}
                  alt={shelter.name}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800">
                  {shelter.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  {shelter.address}
                </p>

                <p className="text-sm text-gray-600">
                  {shelter.phone}
                </p>

                <Link
                  to={`/shelters/${shelter.id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline text-sm font-medium"
                >
                  Ver mascotas →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
