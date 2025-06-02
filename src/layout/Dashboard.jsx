import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../assets/logo.jpg';
import AuthContext from '../context/AuthProvider';


const Dashboard = () => {
  const {auth} = useContext(AuthContext)

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Layout principal dividido en sidebar y contenido */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-black text-white flex flex-col p-4 shadow-lg overflow-y-auto">
          <div className="mb-8 flex flex-col items-center">
            <img src={Logo} alt="Logo" className="w-24 h-24 rounded-full" />
            <h1 className="text-center text-lg font-bold mt-2">SISTEMA DE INVENTARIO</h1>
            <p className="text-sm text-gray-300 mt-1 uppercase">{auth.rol}</p>
          </div>
          <nav className="flex-grow">
            <ul className="space-y-2 text-sm">
              {/* STOCK */}
              <li className="px-4 py-2 hover:bg-gray-700 rounded font-semibold">
                <Link to="/dashboard/stock">STOCK</Link>
              </li>

              {
		            (auth.rol === "Administrador")&&
		          (
              <>
                <li className="px-4 py-2 hover:bg-gray-700 rounded font-semibold">
                  <Link to="/dashboard/categories">CATEGORIAS</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-700 rounded font-semibold">
                  <Link to="/dashboard/accesories">ACCESORIOS</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-700 rounded font-semibold">
                  <Link to="/dashboard/dispositives">DISPOSITIVOS</Link>
                </li>
                </>
              )}
              <li className="px-4 py-2 hover:bg-gray-700 rounded font-semibold">
                <Link to="/dashboard/sales">REGISTRAR VENTA</Link>
              </li>
              {/* Menús con Submenús */}
              {[
                {
                  title: "HISTORIAL",
                  links: [
                     ...(auth.rol === "Administrador" ? [
                      { label: "Ingresos Dispositivos", href: "/dashboard/historyDispositives" },
                      { label: "Ingresos Accesorios", href: "/dashboard/historyAccesories" },
                      { label: "Movimientos", href: "/dashboard/historyMoves" },
                    ] : []),  
                    { label: "Ventas", href: "/dashboard/historySales" },
                  ]
                },
              ].map((menu, idx) => (
                <li key={idx} className="group">
                  <div className="px-4 py-2 font-semibold hover:bg-gray-700 rounded cursor-pointer">
                    {menu.title}
                  </div>
                  <ul className="hidden group-hover:flex flex-col bg-black w-full space-y-1 mt-1">
                    {menu.links.map((link, i) => (
                      <li key={i} className="px-6 py-2 hover:bg-gray-700 rounded text-sm">
                        {link.to ? (
                          <Link to={link.to}>{link.label}</Link>
                        ) : (
                          <a href={link.href}>{link.label}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

              {
		            (auth.rol === "Administrador")&&
		          (
              <li className="px-4 py-2 hover:bg-gray-700 rounded font-semibold">
                <Link to="/dashboard/users">USUARIOS</Link>
              </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <div className="flex flex-col flex-grow">
          {/* Header */}
          <header className="bg-black text-white shadow p-4 flex justify-end items-center">
            <span className="text-base mr-4">Bienvenido - {auth?.nombre}</span>
            <Link
              to="/"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => {
                localStorage.removeItem('token');
              }}
            >
              Salir
            </Link>
          </header>

          {/* Main Section */}
          <main className="p-8 overflow-y-auto flex-grow">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-black text-gray-400 text-center p-4 text-sm">
            &copy; {new Date().getFullYear()} Sistema de Inventario. Todos los derechos reservados.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
