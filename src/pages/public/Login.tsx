import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { loginRequest } from '../../api/authApi';

const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setApiError(null);
      const response = await loginRequest(data);
      login(response.access, response.user);
      navigate(response.user.is_staff ? '/admin/solicitudes' : '/');
    } catch (error: any) {
      setApiError(
        error.response?.status === 401
          ? 'Credenciales incorrectas. Verifica tu usuario y contraseña.'
          : 'Ocurrió un error en el servidor. Inténtalo más tarde.'
      );
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      {/* CARD */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
          Iniciar Sesión
        </h2>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* USER */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              {...register('username')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white font-medium py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-60"
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Aún no tienes una cuenta?{' '}
            <Link
              to="/registro"
              className="font-medium text-purple-600 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
