import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPetById, updatePet } from '../../api/petApi';

const petSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  species: z.string().min(1, 'La especie es requerida'),
  breed: z.string().min(1, 'La raza es requerida'),
  age: z.number().min(0, 'La edad debe ser mayor o igual a 0'),
  gender: z.string().min(1, 'El género es requerido'),
  status: z.string().min(1, 'El estado es requerido'),
  shelter: z.number().min(1, 'El ID del refugio es requerido'),
  photo: z.any().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

export const EditPet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
  });

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      try {
        setApiError(null);
        const petData = await getPetById(id);
        setCurrentPhotoUrl(petData.photo || null); 
        reset({
          name: petData.name,
          species: petData.species,
          breed: petData.breed,
          age: petData.age,
          gender: petData.gender,
          status: petData.status,
          shelter: petData.shelter || 1,
        });
      } catch (err) {
        setApiError('No se pudo cargar la información de la mascota.');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
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

      if (data.photo && data.photo instanceof FileList && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }

      await updatePet(Number(id), formData);
      navigate('/admin/mascotas');
    } catch (error) {
      setApiError('Ocurrió un error al actualizar la mascota. Verifica que la imagen no sea muy pesada.');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando datos...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Editar Mascota #{id}</h1>
      {apiError && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input {...register('name')} className="w-full px-4 py-2 border rounded-md" />
             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Especie</label>
            <select {...register('species')} className="w-full px-4 py-2 border rounded-md bg-white">
              <option value="Dog">Perro</option>
              <option value="Cat">Gato</option>
              <option value="Other">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Raza</label>
            <input {...register('breed')} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Género</label>
            <select {...register('gender')} className="w-full px-4 py-2 border rounded-md bg-white">
              <option value="Male">Macho</option>
              <option value="Female">Hembra</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Edad</label>
            <input type="number" {...register('age', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ID Refugio</label>
            <input type="number" {...register('shelter', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select {...register('status')} className="w-full px-4 py-2 border rounded-md bg-white">
              <option value="Available">Disponible</option>
              <option value="Adopted">Adoptado</option>
              <option value="Deceased">Fallecido</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foto de la Mascota</label>
          
          {currentPhotoUrl && (
            <div className="mb-4 p-2 border rounded-md bg-gray-50 inline-block">
              <p className="text-xs text-gray-500 mb-2">Imagen actual:</p>
              <img src={currentPhotoUrl} alt="Foto actual" className="h-32 w-auto object-cover rounded-md" />
            </div>
          )}

          <div className="mt-2">
            <label className="block text-sm text-gray-600 mb-1">Cambiar imagen (opcional):</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              {...register('photo')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button type="button" onClick={() => navigate('/admin/mascotas')} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium">
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};