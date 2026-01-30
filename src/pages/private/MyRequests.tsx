import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyAdoptionRequests } from '../../api/adoptionApi';
import type { AdoptionResponse } from '../../api/adoptionApi';

export const MyRequests = () => {
  const [requests, setRequests] = useState<AdoptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getMyAdoptionRequests();
        setRequests(data);
      } catch {
        setError('No se pudieron cargar tus solicitudes. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return (
          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
            Aprobada
          </span>
        );
      case 'REJECTED':
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
            Rechazada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-medium">
            Pendiente
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500 font-medium">
        Cargando tus solicitudes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Solicitudes de Adopción
        </h1>
        <p className="text-gray-600 mt-2">
          Sigue el estado de las mascotas que has solicitado adoptar.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-500 mb-4">
            Aún no has enviado ninguna solicitud de adopción.
          </p>
          <Link
            to="/mascotas"
            className="text-blue-600 font-medium hover:underline"
          >
            Ver mascotas disponibles
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mascota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha de solicitud
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
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {request.pet_name ?? `Mascota #${request.pet}`}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(request.request_date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      to={`/mascotas/${request.pet}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver mascota
                    </Link>
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