import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createPet } from '../../api/petApi';
import { getShelters } from '../../api/shelters.api';

const petSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  species: z.string().min(1, 'La especie es requerida'),
  breed: z.string().min(1, 'La raza es requerida'),
  age: z.number().min(0, 'La edad debe ser mayor o igual a 0'),
  gender: z.string().min(1, 'El género es requerido'),
  status: z.string().min(1, 'El estado es requerido'),
  shelter: z.number().min(1, 'Debes seleccionar un refugio'),
  photo: z.any().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

interface Shelter {
  id: number;
  name: string;
  is_active: boolean;
}

export const AddPet = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: '',
      status: 'Available',
      shelter: undefined,
    },
  });

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const data = await getShelters();
        // Solo refugios activos
        setShelters(data.filter((s: Shelter) => s.is_active));
      } catch {
        setApiError('No se pudieron cargar los refugios.');
      }
    };

    fetchShelters();
  }, []);

  const onSubmit: SubmitHandler<PetFormValues> = async (data) => {
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
      formData.append(
        'admission_date',
        new Date().toISOString().split('T')[0]
      );

      if (data.photo && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }

      const newPet = await createPet(formData);
      navigate(`/mascotas/${newPet.id}`);
    } catch {
      setApiError(
        'Ocurrió un error al guardar la mascota. Verifica los datos o la imagen.'
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Agregar Nueva Mascota
        </h1>
        <p className="text-gray-600">
          Ingresa los detalles y sube una foto.
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Ej. Bobby"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especie
            </label>
            <input
              {...register('species')}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Ej. Perro, Gato..."
            />
            {errors.species && (
              <p className="mt-1 text-xs text-red-500">
                {errors.species.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raza
            </label>
            <input
              {...register('breed')}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.breed && (
              <p className="mt-1 text-xs text-red-500">
                {errors.breed.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2 border rounded-md bg-white"
            >
              <option value="">Selecciona...</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad (Años)
            </label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.age && (
              <p className="mt-1 text-xs text-red-500">
                {errors.age.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refugio
            </label>
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
              <p className="mt-1 text-xs text-red-500">
                {errors.shelter.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto de la Mascota
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            {...register('photo')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-500"
          />
        </div>

        {/* Acciones */}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Subiendo...' : 'Guardar Mascota'}
          </button>
        </div>

      </form>
    </div>
  );
};
