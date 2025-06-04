import { useState, useEffect } from "react";
import axios from "axios";
import ModalUsuario from "../components/Modals/ModalUser";
import TableUsers from "../components/TableUsers";

const Users = () => {

  const [users, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);  

  const listUsers = async () => {
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
        console.log(error);
      }
    };

    useEffect(() => {
      listUsers();
    }, []);

    // Vuelve a cargar los usuarios después de agregar
    const handleAgregarUsuario = (nuevoUsuario) => {
      setModalOpen(false);
      listUsers();
    };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-black">Usuarios Registrados</h1>
        <button
          className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm md:text-base"
          onClick={() => setModalOpen(true)}
        >
          + Registrar Usuario
        </button>
      </div>
      <div className="overflow-x-auto">
        <TableUsers users={users} listUsers={listUsers} />
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
