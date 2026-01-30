import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getAdoptionRequestById,
  approveAdoptionRequest,
  rejectAdoptionRequest,
} from '../../api/adoptionApi';

export const AdminAdoptionRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await getAdoptionRequestById(Number(id));
        setRequest(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm('¿Aprobar esta solicitud?')) return;
    await approveAdoptionRequest(request.id);
    navigate('/admin/solicitudes');
  };

  const handleReject = async () => {
    if (!window.confirm('¿Rechazar esta solicitud?')) return;
    await rejectAdoptionRequest(request.id);
    navigate('/admin/solicitudes');
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Cargando…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow border">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Solicitud de adopción
      </h1>

      {/* Mascota */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-gray-700">Mascota</h2>
        <p className="text-gray-600">
          {request.pet_name} · {request.pet_species}
        </p>
      </div>

      {/* Usuario */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-700">Solicitante</h3>
          <p>{request.user_name}</p>
          <p className="text-sm text-gray-500">{request.user_email}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-700">Contacto</h3>
          <p>{request.phone_number || '—'}</p>
        </div>
      </div>

      {/* Dirección */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700">Dirección</h3>
        <p className="text-gray-600">{request.address || '—'}</p>
      </div>

      {/* Otras mascotas */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700">Otras mascotas</h3>
        <p>{request.has_other_pets ? 'Sí' : 'No'}</p>
      </div>

      {/* Foto hogar */}
      {request.home_photo && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">
            Foto del hogar
          </h3>
          <img
            src={request.home_photo}
            alt="Hogar"
            className="rounded-lg max-h-64 object-cover border"
          />
        </div>
      )}

      {/* Notas */}
      {request.notes && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700">Notas</h3>
          <p className="text-gray-600">{request.notes}</p>
        </div>
      )}

      {/* Acciones */}
      {request.status === 'PENDING' && (
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            onClick={handleReject}
            className="px-6 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
          >
            Rechazar
          </button>
          <button
            onClick={handleApprove}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Aprobar
          </button>
        </div>
      )}
    </div>
  );
};