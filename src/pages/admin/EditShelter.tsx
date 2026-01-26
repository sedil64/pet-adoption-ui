import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  getShelterById,
  updateShelter,
  deleteShelter,
} from '../../api/shelters.api';

const shelterSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
  photo: z.any().optional(),
});

type ShelterFormValues = z.infer<typeof shelterSchema>;

export const EditShelter = () => {
  const { id } = useParams<{ id: string }>();
  const shelterId = Number(id);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShelterFormValues>({
    resolver: zodResolver(shelterSchema),
  });

  useEffect(() => {
    const fetchShelter = async () => {
      try {
        const data = await getShelterById(shelterId);

        reset({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email ?? '',
          is_active: data.is_active,
        });
      } catch {
        setApiError('No se pudo cargar el refugio.');
      } finally {
        setLoading(false);
      }
    };

    fetchShelter();
  }, [shelterId, reset]);

  const onSubmit = async (data: ShelterFormValues) => {
    try {
      setApiError(null);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('phone', data.phone);
      formData.append('email', data.email ?? '');
      formData.append('is_active', String(data.is_active ?? true));

      if (data.photo && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }

      await updateShelter(shelterId, formData);
      navigate('/shelters');
    } catch {
      setApiError('Error al guardar los cambios.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      '¿Estás seguro de eliminar este refugio? Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    try {
      await deleteShelter(shelterId);
      navigate('/shelters');
    } catch {
      alert('No se pudo eliminar el refugio.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando refugio...</p>;
  }

return (
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
    <div className="mb-6 border-b pb-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Editar Refugio
      </h1>
      <p className="text-gray-600">
        Actualiza la información del refugio.
      </p>
    </div>

    {apiError && (
      <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
        {apiError}
      </div>
    )}

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 border rounded-md"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          {...register('address')}
          className="w-full px-4 py-2 border rounded-md"
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-500">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Teléfono + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            {...register('phone')}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cambiar foto
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          {...register('photo')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-500"
        />
      </div>

      {/* Activo */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register('is_active')}
          className="h-4 w-4"
        />
        <span className="text-sm text-gray-700">
          Refugio activo
        </span>
      </div>

      {/* Acciones */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          type="button"
          onClick={handleDelete}
          className="text-red-600 hover:underline text-sm font-medium"
        >
          Eliminar refugio
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/shelters')}
            className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Refugio'}
          </button>
        </div>
      </div>

    </form>
  </div>
);

};
