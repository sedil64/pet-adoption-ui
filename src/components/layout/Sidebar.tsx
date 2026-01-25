import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, isAdmin, logout } = useAuthStore();

  if (!user) return null;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 right-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
            <p className="text-sm text-gray-500">{isAdmin ? 'Administrador' : 'Adoptante'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 font-bold text-lg px-2">
            X
          </button>
        </div>

        <nav className="p-4 space-y-2 font-medium">
          
          {isAdmin ? (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administración
              </div>
              <Link to="/admin/solicitudes" onClick={onClose} className="block p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                Gestión de Solicitudes
              </Link>
              <Link to="/admin/usuarios" onClick={onClose} className="block p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                Gestionón de Usuarios
              </Link>
              <Link to="/admin/mascotas" className="block p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                Gestión de Mascotas
              </Link>
            </>
          ) : (
            <Link to="/mis-solicitudes" onClick={onClose} className="block p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              Mis Solicitudes
            </Link>
          )}

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Cuenta
          </div>
          <Link to="/perfil" onClick={onClose} className="block p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
            Cambiar Contraseña
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
          <button 
            onClick={() => {
              logout();
              onClose();
            }} 
            className="w-full p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};