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
        ? 'text-purple-700 border-b-2 border-purple-700 pb-1'
        : 'text-gray-600 hover:text-purple-600'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-purple-700 font-bold text-xl tracking-tight hover:opacity-80 transition"
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
              <NavLink to="/shelters" className={navLinkClasses}>
                Refugios
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm"
              >
                Iniciar sesión
              </Link>
            ) : (
              <button
                aria-label="Abrir menú de perfil"
                onClick={onOpenSidebar}
                className="hidden md:flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition"
              >
                <span>Mi perfil</span>
                <span className="text-sm">▾</span>
              </button>
            )}

            <button
              onClick={onOpenSidebar}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
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
