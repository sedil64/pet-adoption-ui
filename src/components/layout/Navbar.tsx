import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  const { isAuthenticated } = useAuthStore();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-colors ${
      isActive
        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
        : 'text-gray-600 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-blue-600 font-bold text-xl tracking-tight hover:opacity-80 transition"
            >
              Puppy Family
            </Link>

            <div className="hidden md:flex space-x-6">
              <NavLink to="/" className={navLinkClasses}>
                Inicio
              </NavLink>
              <NavLink to="/mascotas" className={navLinkClasses}>
                Mascotas
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Iniciar sesión
              </Link>
            ) : (
              <button
                aria-label="Abrir menú de perfil"
                onClick={onOpenSidebar}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <span>Mi perfil</span>
                <span className="text-sm">▾</span>
              </button>
            )}

            <button
              onClick={onOpenSidebar}
              className="md:hidden text-gray-600 text-xl"
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
