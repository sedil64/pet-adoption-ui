import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPetById } from '../../api/petApi';
import { useAuthStore } from '../../store/authStore';
import type { Pet } from '../../types/pet.types';

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

  const [myAdoption, setMyAdoption] = useState<MyAdoptionResponse | null>(null);
  const [loadingAdoption, setLoadingAdoption] = useState(false);

  // 🔹 Cargar mascota
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

  // 🔹 Cargar mi solicitud (si estoy autenticado)
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
      <div className="text-center py-12 text-gray-500 font-medium">
        Cargando detalles...
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        {error || 'Mascota no encontrada'}
      </div>
    );
  }

  const defaultImage =
    'https://placehold.co/600x400/e2e8f0/475569?text=Sin+Foto';

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
      <div className="md:flex">
        {/* Imagen */}
        <div className="md:w-1/2 bg-gray-100">
          <img
            src={pet.photo || defaultImage}
            alt={pet.name}
            className="w-full h-full object-cover min-h-[300px]"
          />
        </div>

        {/* Detalles */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {pet.name}
            </h1>
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium border ${
                pet.status === 'Available'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {pet.status === 'Available' ? 'Disponible' : pet.status}
            </span>
          </div>

          <div className="space-y-4 text-gray-600 mb-8 flex-1">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Especie:</span>
              <span>{pet.species}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Raza:</span>
              <span>{pet.breed}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Edad:</span>
              <span>{pet.age} años</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Género:</span>
              <span>{pet.gender}</span>
            </div>
            {pet.shelter_name && (
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Refugio:</span>
                <span>{pet.shelter_name}</span>
              </div>
            )}
          </div>

          {/* Acciones */}
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
                    {myAdoption.adoption?.status}
                  </span>

                  {myAdoption.adoption?.status === 'PENDING' && (
                    <p className="text-sm text-gray-600">
                      Tu solicitud está en revisión.
                    </p>
                  )}

                  {myAdoption.adoption?.status === 'APPROVED' && (
                    <p className="text-sm text-green-700 font-medium">
                      🎉 ¡Tu solicitud fue aprobada!
                    </p>
                  )}

                  {myAdoption.adoption?.status === 'REJECTED' && (
                    <p className="text-sm text-red-600">
                      Tu solicitud fue rechazada.
                    </p>
                  )}
                </div>
              ) : pet.status === 'Available' ? (
                <button
                  onClick={() => navigate(`/adoptar/${pet.id}`)}
                  className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Adoptar a {pet.name}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-500 font-medium py-3 px-4 rounded-md cursor-not-allowed"
                >
                  Mascota no disponible para adopción
                </button>
              )
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-500">
                  Debes iniciar sesión para iniciar el proceso de adopción.
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-gray-800 text-white font-medium py-3 px-4 rounded-md hover:bg-gray-900 transition-colors shadow-sm"
                >
                  Iniciar sesión para adoptar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};