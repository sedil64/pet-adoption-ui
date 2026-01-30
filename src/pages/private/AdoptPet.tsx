import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { getPetById } from '../../api/petApi';
import { createAdoptionRequest } from '../../api/adoptionApi';
import type { Pet } from '../../types/pet.types';

interface AdoptionFormValues {
  notes?: string;
  phone_number?: string;
  address?: string;
  has_other_pets?: boolean;
  home_photo?: FileList;
}

export const AdoptPet = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [pet, setPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AdoptionFormValues>();

  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;
      try {
        const data = await getPetById(petId);
        setPet(data);
      } catch {
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

      const formData = new FormData();
      formData.append('pet', String(pet.id));

      if (data.notes) formData.append('notes', data.notes);
      if (data.phone_number) formData.append('phone_number', data.phone_number);
      if (data.address) formData.append('address', data.address);
      if (data.has_other_pets !== undefined) {
        formData.append('has_other_pets', String(data.has_other_pets));
      }
      if (data.home_photo && data.home_photo[0]) {
        formData.append('home_photo', data.home_photo[0]);
      }

      await createAdoptionRequest(formData);
      navigate('/mis-solicitudes');
    } catch {
      setSubmitError('Ocurrió un error al enviar la solicitud. Intenta nuevamente.');
    }
  };

  if (loadingPet) {
    return (
      <div className="text-center py-12 text-gray-500 font-medium">
        Cargando formulario...
      </div>
    );
  }

  if (!pet || !user) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        Información no disponible.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Solicitud de Adopción
      </h1>
      <p className="text-gray-600 mb-6">
        Estás a un paso de darle un hogar a{' '}
        <span className="font-semibold text-gray-800">{pet.name}</span>.
      </p>

      {submitError && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Datos usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              value={user.username}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo
            </label>
            <input
              value={user.email}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de contacto
          </label>
          <input
            {...register('phone_number')}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="+593 9xxxxxxx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección del hogar
          </label>
          <textarea
            {...register('address')}
            rows={2}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ciudad, barrio, referencias..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register('has_other_pets')}
            className="h-4 w-4 text-blue-600"
          />
          <label className="text-sm text-gray-700">
            Actualmente tengo otras mascotas
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto del lugar donde vivirá la mascota (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('home_photo')}
            className="w-full text-sm text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Por qué deseas adoptar?
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Cuéntanos sobre el hogar que le ofrecerías…"
          />
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(`/mascotas/${pet.id}`)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};