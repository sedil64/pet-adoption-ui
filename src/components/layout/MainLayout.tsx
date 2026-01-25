import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

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
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 🔥 ESTE DIV ES LA CLAVE */}
      <div
        className={`flex-1 flex ${
          isHomeOrAuth ? 'bg-white/70' : ''
        }`}
      >
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
    </div>
  );
};
