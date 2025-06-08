import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ModalUsuario from "../components/Modals/ModalUser";
import TableUsers from "../components/TableUsers";

const Users = () => {
  const [users, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const listUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_BACKEND_URL}/users`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(url, options);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    listUsers();
  }, [listUsers]);

  const handleAgregarUsuario = useCallback(() => {
    setModalOpen(false);
    listUsers();
  }, [listUsers]);

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-black">Usuarios Registrados</h1>
        <button
          className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm md:text-base flex items-center justify-center gap-2"
          onClick={() => setModalOpen(true)}
          disabled={isLoading}
        >
          <span>+</span>
          <span>Registrar Usuario</span>
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-600 bg-red-50 border-l-4 border-red-500">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Cargando usuarios...</p>
            </div>
          </div>
        ) : (
          <TableUsers users={users} listUsers={listUsers} />
        )}
      </div>

      {modalOpen && (
        <ModalUsuario 
          onClose={() => setModalOpen(false)}
          listUsers={listUsers} 
          onGuardar={handleAgregarUsuario}
        />
      )}
    </div>
  );
};

export default Users;
