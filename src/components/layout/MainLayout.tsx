import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isHomeOrAuth =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/registro';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={
        isHomeOrAuth
          ? {
              backgroundImage: "url('/images/fondo_pagina.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: '#f9fafb' }
      }
    >
      {/* NAVBAR */}
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* CONTENIDO */}
      <div className={`flex-1 ${isHomeOrAuth ? 'bg-white/70' : ''}`}>
        <main
          className={
            isHomeOrAuth
              ? 'flex-1 w-full p-0 flex items-center justify-center'
              : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'
          }
        >
          <Outlet />
        </main>
      </div>

      {/* FOOTER (SIEMPRE ABAJO) */}
      <Footer />
    </div>
  );
};
