import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getPetById, updatePet } from '../../api/petApi';
import { getShelters } from '../../api/shelters.api';

interface Shelter {
  id: number;
  name: string;
  is_active: boolean;
}

const petSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  species: z.string().min(1, 'La especie es requerida'),
  breed: z.string().min(1, 'La raza es requerida'),
  age: z.number().min(0, 'La edad debe ser mayor o igual a 0'),
  gender: z.string().min(1, 'El género es requerido'),
  status: z.string().min(1, 'El estado es requerido'),
  shelter: z.number().min(1, 'Debes seleccionar un refugio'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  photo: z.any().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

export const EditPet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setApiError(null);

        const [petData, sheltersData] = await Promise.all([
          getPetById(id),
          getShelters(),
        ]);

        setShelters(sheltersData.filter((s: Shelter) => s.is_active));
        setCurrentPhotoUrl(petData.photo || null);

        reset({
          name: petData.name,
          species: petData.species,
          breed: petData.breed,
          age: petData.age,
          gender: petData.gender,
          status: petData.status,
          shelter: petData.shelter, // 👈 ID del refugio
          description: petData.description ?? '',
        });
      } catch {
        setApiError('No se pudo cargar la información de la mascota.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit: SubmitHandler<PetFormValues> = async (data) => {
    if (!id) return;
    try {
      setApiError(null);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('species', data.species);
      formData.append('breed', data.breed);
      formData.append('age', data.age.toString());
      formData.append('gender', data.gender);
      formData.append('status', data.status);
      formData.append('shelter', data.shelter.toString());
      formData.append('description', data.description);

      if (data.photo && data.photo instanceof FileList && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }

      await updatePet(Number(id), formData);
      navigate('/admin/mascotas');
    } catch {
      setApiError(
        'Ocurrió un error al actualizar la mascota. Verifica que la imagen no sea muy pesada.'
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Cargando datos...
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Editar Mascota #{id}
      </h1>

      {apiError && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Especie</label>
            <select
              {...register('species')}
              className="w-full px-4 py-2 border rounded-md bg-white"
            >
              <option value="Dog">Perro</option>
              <option value="Cat">Gato</option>
              <option value="Other">Otro</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Raza</label>
            <input
              {...register('breed')}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Género</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2 border rounded-md bg-white"
            >
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Edad</label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Refugio</label>
            <select
              {...register('shelter', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-md bg-white"
            >
              <option value="">Selecciona un refugio</option>
              {shelters.map((shelter) => (
                <option key={shelter.id} value={shelter.id}>
                  {shelter.name}
                </option>
              ))}
            </select>
            {errors.shelter && (
              <p className="text-red-500 text-xs mt-1">
                {errors.shelter.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border rounded-md bg-white"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="ADOPTED">Adoptado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Foto de la Mascota
          </label>

          {currentPhotoUrl && (
            <div className="mb-4 p-2 border rounded-md bg-gray-50 inline-block">
              <p className="text-xs text-gray-500 mb-2">Imagen actual:</p>
              <img
                src={currentPhotoUrl}
                alt="Foto actual"
                className="h-32 object-cover rounded-md"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            {...register('photo')}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/mascotas')}
            className="px-6 py-2 bg-gray-100 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};