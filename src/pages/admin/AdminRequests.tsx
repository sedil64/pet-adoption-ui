import { useEffect, useState } from 'react';
import { getAllAdoptionRequests, updateAdoptionRequestStatus } from '../../api/adoptionApi';

interface RequestWithDetails {
  id: number;
  pet: number;
  user: number;
  status: string;
  created_at: string;
}

export const AdminRequests = () => {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllAdoptionRequests();
      setRequests(data);
    } catch (err) {
      setError('No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const actionText = newStatus === 'approved' ? 'aprobar' : 'rechazar';
    if (!window.confirm(`¿Estás seguro de que deseas ${actionText} esta solicitud?`)) return;

    try {
      await updateAdoptionRequestStatus(id, { status: newStatus });
      setRequests((prev) => 
        prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
      );
    } catch (err) {
      alert('Ocurrió un error al actualizar el estado.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">Aprobada</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">Rechazada</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-medium">Pendiente</span>;
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Cargando todas las solicitudes...</div>;
  if (error) return <div className="text-center py-12 text-red-600 font-medium">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Solicitudes</h1>
        <p className="text-gray-600 mt-2">Revisa, aprueba o rechaza las peticiones de adopción de los usuarios.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Req.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario (ID)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota (ID)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">#{request.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Usuario #{request.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mascota #{request.pet}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {request.status.toLowerCase() === 'pending' || request.status.toLowerCase() === 'in_review' ? (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(request.id, 'approved')}
                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md transition-colors"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(request.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors"
                      >
                        Rechazar
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Acción completada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};