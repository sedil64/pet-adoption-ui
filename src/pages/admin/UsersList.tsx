import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '../../api/userApi';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types/auth.types';

export const UsersList = () => {
  const currentUser = useAuthStore((state) => state.user);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError('No se pudo cargar la lista de usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStaff = async (userId: number, currentStaffStatus: boolean) => {
    if (userId === currentUser?.id) {
      alert('No puedes modificar tus propios permisos de administrador.');
      return;
    }

    const newStaffStatus = !currentStaffStatus;
    const actionText = newStaffStatus ? 'otorgar' : 'quitar';
    
    if (!window.confirm(`¿Estás seguro de ${actionText} los permisos de administrador a este usuario?`)) return;

    try {
      await updateUserRole(userId, { is_staff: newStaffStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, is_staff: newStaffStatus } : u));
    } catch (err) {
      alert('Ocurrió un error al actualizar el rol del usuario.');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Cargando usuarios...</div>;
  if (error) return <div className="text-center py-12 text-red-600 font-medium">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <p className="text-gray-600 mt-2">Administra los permisos y roles de todos los usuarios registrados.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">#{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_staff ? (
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium">
                      Administrador
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-medium">
                      Adoptante
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleToggleStaff(user.id, user.is_staff)}
                    disabled={user.id === currentUser?.id}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      user.id === currentUser?.id 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : user.is_staff
                          ? 'text-red-600 hover:text-red-900 bg-red-50'
                          : 'text-blue-600 hover:text-blue-900 bg-blue-50'
                    }`}
                  >
                    {user.id === currentUser?.id ? 'Tú (Sin acción)' : (user.is_staff ? 'Quitar Admin' : 'Hacer Admin')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};