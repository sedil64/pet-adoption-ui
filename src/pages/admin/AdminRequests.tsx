import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllAdoptionRequests,
  approveAdoptionRequest,
  rejectAdoptionRequest,
} from '../../api/adoptionApi';
import type { AdoptionResponse } from '../../api/adoptionApi';

type AdoptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

const STATUS_CONFIG: Record<
  AdoptionStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  APPROVED: {
    label: 'Aprobada',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  REJECTED: {
    label: 'Rechazada',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  CANCELLED: {
    label: 'Cancelada',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
};

export const AdminRequests = () => {
  const [requests, setRequests] = useState<AdoptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllAdoptionRequests();
      setRequests(data);
    } catch {
      setError('No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    if (!window.confirm('¿Deseas aprobar esta solicitud?')) return;

    try {
      await approveAdoptionRequest(id);
      await fetchRequests();
    } catch {
      alert('Error al aprobar la solicitud.');
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm('¿Deseas rechazar esta solicitud?')) return;

    try {
      await rejectAdoptionRequest(id);
      await fetchRequests();
    } catch {
      alert('Error al rechazar la solicitud.');
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 text-red-600 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Panel de Adopciones
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mascota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {requests.map((req) => {
              const statusKey = req.status.toUpperCase() as AdoptionStatus;
              const config = STATUS_CONFIG[statusKey];

              return (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.user_name}</div>
                    <div className="text-xs text-gray-500">{req.user_email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium">{req.pet_name}</div>
                    <div className="text-xs uppercase text-indigo-600">
                      {req.pet_species}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(req.request_date)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
                    >
                      {config.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/solicitudes/${req.id}`}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md"
                      >
                        Ver detalle
                      </Link>

                      {statusKey === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-md"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {requests.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No hay solicitudes registradas.
          </div>
        )}
      </div>
    </div>
  );
};