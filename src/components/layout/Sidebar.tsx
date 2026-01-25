import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, isAdmin, logout } = useAuthStore();

  if (!user) return null;

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `block p-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menú de usuario"
        className={`fixed inset-y-0 right-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                {user.username}
              </h2>
              <p className="text-xs text-gray-500">
                {isAdmin ? 'Administrador' : 'Adoptante'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="text-gray-400 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <nav className="p-4 space-y-2 font-medium">
          {isAdmin ? (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administración
              </div>

              <NavLink to="/admin/solicitudes" onClick={onClose} className={linkClasses}>
                Gestión de Solicitudes
              </NavLink>

              <NavLink to="/admin/usuarios" onClick={onClose} className={linkClasses}>
                Gestión de Usuarios
              </NavLink>

              <NavLink to="/admin/mascotas" onClick={onClose} className={linkClasses}>
                Gestión de Mascotas
              </NavLink>
            </>
          ) : (
            <NavLink to="/mis-solicitudes" onClick={onClose} className={linkClasses}>
              Mis Solicitudes
            </NavLink>
          )}

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Cuenta
          </div>

          <NavLink to="/perfil" onClick={onClose} className={linkClasses}>
            Cambiar Contraseña
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};