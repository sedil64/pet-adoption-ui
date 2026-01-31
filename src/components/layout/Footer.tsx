import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-purple-950 border-t border-purple-900 mt-16 text-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/puppy_family_logo.png"
                alt="Puppy Family"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-purple-200 text-sm max-w-md">
              Puppy Family es una plataforma dedicada a conectar refugios con
              personas responsables que desean adoptar y cambiar una vida.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-purple-300 hover:text-white transition"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/mascotas"
                  className="text-purple-300 hover:text-white transition"
                >
                  Mascotas
                </Link>
              </li>
              <li>
                <Link
                  to="/shelters"
                  className="text-purple-300 hover:text-white transition"
                >
                  Refugios
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-purple-300">
              <li>📍 Quito-Ecuador</li>
              <li>📧 puppy.family.app@gmail.com</li>
              <li>❤️ Adopción responsable</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-purple-300">
            © {new Date().getFullYear()} Puppy Family. Todos los derechos reservados.
          </p>

          <p className="text-xs text-purple-400">
            Hecho con ❤️ para salvar vidas
          </p>
        </div>
      </div>
    </footer>
  );
};
