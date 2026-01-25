import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser } from '../../api/authApi';

const registerSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      setApiError(null);
      setSuccessMessage(null);
      
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (error: any) {
      if (error.response?.data?.username) {
        setApiError('Este nombre de usuario ya está registrado.');
      } else if (error.response?.data?.email) {
        setApiError('Este correo electrónico ya está en uso.');
      } else {
        setApiError('Ocurrió un error al crear la cuenta. Intenta de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Crear una cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a Puppy Family y adopta a tu nuevo mejor amigo.</p>
        </div>

        {apiError && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-100 font-medium text-center shadow-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
            <input
              type="text"
              disabled={!!successMessage}
              {...register('username')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="ej. juanperez"
            />
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              disabled={!!successMessage}
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="juan@ejemplo.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              disabled={!!successMessage}
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              disabled={!!successMessage}
              {...register('confirm_password')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !!successMessage}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 mt-6"
          >
            {isSubmitting ? 'Creando cuenta...' : successMessage ? 'Redirigiendo...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
};