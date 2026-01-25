import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { getPetById } from '../../api/petApi';
import { createAdoptionRequest } from '../../api/adoptionApi';
import type { Pet } from '../../types/pet.types';

interface AdoptionFormValues {
  notes: string;
}

export const AdoptPet = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [pet, setPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AdoptionFormValues>();
  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;
      try {
        const data = await getPetById(petId);
        setPet(data);
      } catch (err) {
        setSubmitError('No se pudo cargar la información de la mascota.');
      } finally {
        setLoadingPet(false);
      }
    };
    fetchPet();
  }, [petId]);
  const onSubmit = async (data: AdoptionFormValues) => {
    if (!user || !pet) return;

    try {
      setSubmitError(null);
      await createAdoptionRequest({
        user: user.id,
        pet: pet.id,
        notes: data.notes,
        status: 'pending'
      });
      navigate('/mis-solicitudes');
    } catch (error) {
      setSubmitError('Ocurrió un error al enviar la solicitud. Intenta nuevamente.');
    }
  };

  if (loadingPet) return <div className="text-center py-12 text-gray-500 font-medium">Cargando formulario...</div>;
  if (!pet || !user) return <div className="text-center py-12 text-red-600 font-medium">Información no disponible.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Solicitud de Adopción</h1>
      <p className="text-gray-600 mb-6 border-b pb-6">
        Estás a un paso de darle un hogar a <span className="font-bold text-gray-800">{pet.name}</span>.
      </p>

      {submitError && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del solicitante</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Por qué deseas adoptar a {pet.name}? <span className="text-gray-400 font-normal">(Opcional)</span>
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Cuéntanos sobre el hogar que le ofrecerías..."
          />
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(`/mascotas/${pet.id}`)}
            className="px-6 py-2 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? 'Enviando solicitud...' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};