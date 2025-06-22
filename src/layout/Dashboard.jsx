import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../assets/logo.jpg';
import AuthContext from '../context/AuthProvider';

const Dashboard = () => {
  const {auth} = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <div className="flex flex-grow overflow-hidden">
        {/* Mobile Menu Button - Improved tap target */}
        <button 
          className="lg:hidden fixed top-4 left-4 z-20 p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Sidebar - Improved mobile handling */}        <aside className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 z-10 w-64 bg-black text-white flex flex-col p-4 shadow-lg min-h-screen transition-transform duration-300 ease-in-out overflow-y-auto`}>
          <div className="mb-6 flex flex-col items-center">
            <img src={Logo} alt="Logo" className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover" />
            <h1 className="text-center text-sm lg:text-base font-bold mt-2">SISTEMA DE INVENTARIO</h1>
            <p className="text-xs text-gray-300 mt-1 uppercase">{auth.rol}</p>
          </div>
          
          {/* Navigation - Improved spacing and touch targets */}
          <nav className="flex-grow">
            <ul className="space-y-1">
              {/* STOCK */}
              <li className="rounded-lg overflow-hidden">
                <Link 
                  to="/dashboard/stock" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  STOCK
                </Link>
              </li>

              {auth.rol === "Administrador" && (
                <>
                  <li className="rounded-lg overflow-hidden">
                    <Link 
                      to="/dashboard/categories" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                    >
                      CATEGORIAS
                    </Link>
                  </li>
                  <li className="rounded-lg overflow-hidden">
                    <Link 
                      to="/dashboard/accesories" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                    >
                      ACCESORIOS
                    </Link>
                  </li>
                  <li className="rounded-lg overflow-hidden">
                    <Link 
                      to="/dashboard/dispositives" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                    >
                      DISPOSITIVOS
                    </Link>
                  </li>
                </>
              )}

              <li className="rounded-lg overflow-hidden">
                <Link 
                  to="/dashboard/sales" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  REGISTRAR VENTA
                </Link>
              </li>

              {/* History Submenu */}
              <li className="group">
                <div className="px-4 py-3 text-sm font-semibold hover:bg-gray-700 rounded-lg transition-colors duration-200 cursor-pointer">
                  HISTORIAL
                </div>
                <ul className="hidden group-hover:block bg-gray-900 rounded-lg mt-1">
                  {auth.rol === "Administrador" && (
                    <>
                      <li>
                        <Link 
                          to="/dashboard/historyDispositives"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-6 py-2 text-xs hover:bg-gray-700 transition-colors duration-200"
                        >
                          Ingresos Dispositivos
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/historyAccesories"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-6 py-2 text-xs hover:bg-gray-700 transition-colors duration-200"
                        >
                          Ingresos Accesorios
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/historyMoves"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-6 py-2 text-xs hover:bg-gray-700 transition-colors duration-200"
                        >
                          Movimientos
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link 
                      to="/dashboard/historySales"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-6 py-2 text-xs hover:bg-gray-700 transition-colors duration-200"
                    >
                      Ventas
                    </Link>
                  </li>
                </ul>
              </li>

              {auth.rol === "Administrador" && (
                <li className="rounded-lg overflow-hidden">
                  <Link 
                    to="/dashboard/users" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                  >
                    USUARIOS
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Mobile overlay with improved transition */}
        {isMobileMenuOpen && (
          <div 
            data-testid="mobile-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          {/* Header with improved mobile layout */}
          <header className="bg-black text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-1"></div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm lg:text-base hidden sm:inline">
                    Bienvenido - {auth?.nombre}
                  </span>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => {
                      localStorage.removeItem('token');
                    }}
                  >
                    Salir
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main content with improved padding */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>

          {/* Footer with improved responsive text and padding */}
          <footer className="bg-black text-gray-400">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs sm:text-sm">
                © 2024 Sistema Inventario GrayThink. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
