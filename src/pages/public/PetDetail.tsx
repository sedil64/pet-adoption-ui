import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPetById } from '../../api/petApi';
import { useAuthStore } from '../../store/authStore';
import type { Pet } from '../../types/pet.types';

const PET_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  ADOPTED: 'Adoptado',
};

const ADOPTION_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
};

type AdoptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

interface MyAdoptionResponse {
  exists: boolean;
  adoption?: {
    id: number;
    status: AdoptionStatus;
    request_date: string;
    notes: string;
  };
}

export const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [myAdoption, setMyAdoption] =
    useState<MyAdoptionResponse | null>(null);
  const [loadingAdoption, setLoadingAdoption] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getPetById(id);
        setPet(data);
      } catch {
        setError('No se pudo cargar la información de la mascota.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    const fetchMyAdoption = async () => {
      try {
        setLoadingAdoption(true);
        const res = await fetch(
          `https://pet-adoption-api.desarrollo-software.xyz/api/adoption-requests/my-for-pet/?pet_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: MyAdoptionResponse = await res.json();
        setMyAdoption(data);
      } catch (e) {
        console.error('Error al cargar solicitud', e);
      } finally {
        setLoadingAdoption(false);
      }
    };

    fetchMyAdoption();
  }, [id, isAuthenticated, token]);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500 font-medium">
        Cargando detalles...
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="text-center py-16 text-red-600 font-medium">
        {error || 'Mascota no encontrada'}
      </div>
    );
  }

  const defaultImage =
    'https://placehold.co/800x600/e2e8f0/475569?text=Sin+Foto';

  const isAvailable = pet.status === 'AVAILABLE';

  return (
    <div className="w-full bg-white border border-gray-100">
      <div className="max-w-6xl mx-auto rounded-lg overflow-hidden shadow-sm">
        <div className="md:flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100">
            <img
              src={pet.photo || defaultImage}
              alt={pet.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {pet.name}
              </h1>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium border ${
                  isAvailable
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {PET_STATUS_LABELS[pet.status] ?? pet.status}
              </span>
            </div>

            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Especie:</span>
                <span>{pet.species}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Raza:</span>
                <span>{pet.breed}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Edad:</span>
                <span>{pet.age} años</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Género:</span>
                <span>{pet.gender}</span>
              </div>
              {pet.shelter_name && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Refugio:</span>
                  <span>{pet.shelter_name}</span>
                </div>
              )}
            </div>
            {pet.description && (
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  Su historia
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {pet.description}
                </p>
              </div>
            )}

            <div className="mt-auto">
              {isAuthenticated ? (
                loadingAdoption ? (
                  <p className="text-sm text-gray-500 text-center">
                    Verificando solicitud...
                  </p>
                ) : myAdoption?.exists ? (
                  <div className="space-y-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        myAdoption.adoption?.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : myAdoption.adoption?.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ADOPTION_STATUS_LABELS[
                        myAdoption.adoption?.status ?? ''
                      ] ?? myAdoption.adoption?.status}
                    </span>
                  </div>
                ) : isAvailable ? (
                  <button
                    onClick={() => navigate(`/adoptar/${pet.id}`)}
                    className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Adoptar a {pet.name}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 py-3 rounded-md cursor-not-allowed"
                  >
                    Mascota no disponible para adopción
                  </button>
                )
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition-colors"
                >
                  Iniciar sesión para adoptar
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};