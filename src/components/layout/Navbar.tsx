import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="bg-white/80 backdrop-blur border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO + LINKS */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-purple-700 font-bold text-xl tracking-tight"
            >
              Puppy Family
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/mascotas"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Mascotas
              </Link>
            </div>
          </div>

          {/* ACCIÓN */}
          <div>
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <button
                onClick={onOpenSidebar}
                className="bg-purple-100 text-purple-700 px-5 py-2 rounded-lg font-medium hover:bg-purple-200 transition"
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
