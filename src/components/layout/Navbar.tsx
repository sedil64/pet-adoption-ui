import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="text-blue-600 font-bold text-xl tracking-tight">
              Puppy Family
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium ms-5">Inicio</Link>
              <Link to="/mascotas" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Mascotas</Link>
            </div>
          </div>

          <div>
            {!isAuthenticated ? (
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <button 
                onClick={onOpenSidebar}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Mi Perfil
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};