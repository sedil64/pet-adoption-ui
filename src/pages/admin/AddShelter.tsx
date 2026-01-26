import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createShelter } from '../../api/shelters.api';

const shelterSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
  photo: z.any().optional(),
});

type ShelterFormValues = z.infer<typeof shelterSchema>;

export const AddShelter = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShelterFormValues>({
    resolver: zodResolver(shelterSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const onSubmit = async (data: ShelterFormValues) => {
    try {
      setApiError(null);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('phone', data.phone);

      if (data.email) {
        formData.append('email', data.email);
      }

      formData.append('is_active', String(data.is_active ?? true));

      if (data.photo && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }

      await createShelter(formData);
      navigate('/shelters');
    } catch {
      setApiError('Error al guardar el refugio.');
    }
  };

return (
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
    <div className="mb-6 border-b pb-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Agregar Refugio
      </h1>
      <p className="text-gray-600">
        Registra un nuevo refugio en el sistema.
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
          placeholder="Ej. Patitas Felices"
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
          placeholder="Ej. Av. Central y 10 de Agosto"
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
            placeholder="Ej. 0999999999"
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
            placeholder="contacto@refugio.org"
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
          Foto del refugio
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          {...register('photo')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Formatos permitidos: JPG, PNG, WebP.
        </p>
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
      <div className="flex justify-end gap-4 pt-4 border-t">
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

    </form>
  </div>
);

};
