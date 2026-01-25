import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { changePassword } from '../../api/authApi';

const passwordSchema = z.object({
  old_password: z.string().min(1, 'La contraseña actual es requerida'),
  new_password: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  confirm_password: z.string().min(1, 'Confirma tu nueva contraseña')
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const Profile = () => {
  const user = useAuthStore((state) => state.user);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await changePassword({
        old_password: data.old_password,
        new_password: data.new_password
      });

      setSuccessMessage('Tu contraseña ha sido actualizada exitosamente.');
      reset();
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrorMessage('La contraseña actual es incorrecta.');
      } else {
        setErrorMessage('Ocurrió un error al cambiar la contraseña. Intenta de nuevo.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-gray-600 mt-2">Gestiona tu información personal y la seguridad de tu cuenta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">Datos de la Cuenta</h2>
          <div className="space-y-4 text-sm">
            <div>
              <span className="block text-gray-500 font-medium">Nombre de usuario</span>
              <span className="block text-gray-900 font-medium text-base">{user.username}</span>
            </div>
            <div>
              <span className="block text-gray-500 font-medium">Correo electrónico</span>
              <span className="block text-gray-900 font-medium text-base">{user.email}</span>
            </div>
            <div>
              <span className="block text-gray-500 font-medium">Tipo de cuenta</span>
              <span className="block text-gray-900 font-medium text-base">
                {user.is_staff ? 'Administrador' : 'Adoptante'}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">Cambiar Contraseña</h2>

          {successMessage && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-100 font-medium">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
              <input
                type="password"
                {...register('old_password')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.old_password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.old_password && <p className="mt-1 text-xs text-red-500">{errors.old_password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
              <input
                type="password"
                {...register('new_password')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.new_password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.new_password && <p className="mt-1 text-xs text-red-500">{errors.new_password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                {...register('confirm_password')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};