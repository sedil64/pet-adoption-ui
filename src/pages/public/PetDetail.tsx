import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPetById } from '../../api/petApi';
import { useAuthStore } from '../../store/authStore';
import type { Pet } from '../../types/pet.types';

export const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getPetById(id);
        setPet(data);
      } catch (err) {
        setError('No se pudo cargar la información de la mascota.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Cargando detalles...</div>;
  if (error || !pet) return <div className="text-center py-12 text-red-600 font-medium">{error || 'Mascota no encontrada'}</div>;

  const defaultImage = 'https://placehold.co/600x400/e2e8f0/475569?text=Sin+Foto';

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 bg-gray-100">
          <img 
            src={pet.photo || defaultImage} 
            alt={pet.name} 
            className="w-full h-full object-cover min-h-[300px]"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
            <span className={`text-sm px-3 py-1 rounded-full font-medium border ${
              pet.status === 'Available' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
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
          <div className="mt-auto">
            {isAuthenticated ? (
              pet.status === 'Available' ? (
                <button 
                  onClick={() => navigate(`/adoptar/${pet.id}`)}
                  className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Adoptar a {pet.name}
                </button>
              ) : (
                <button disabled className="w-full bg-gray-200 text-gray-500 font-medium py-3 px-4 rounded-md cursor-not-allowed">
                  Mascota no disponible para adopción
                </button>
              )
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-500">Debes iniciar sesión para iniciar el proceso de adopción.</p>
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