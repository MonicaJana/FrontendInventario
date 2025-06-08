import { useState, useCallback } from "react";
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalUpdateUser from "./Modals/ModalUpdateUser";

const TableUsers = ({users, listUsers}) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDelete = useCallback(async (cedula) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar este usuario?");
        if (!confirm) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/users/${cedula}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url, options);
            await listUsers();
            setMensaje({ respuesta: "Usuario eliminado correctamente", tipo: true });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setMensaje({ 
                respuesta: error.response?.data?.msg || "Error al eliminar usuario", 
                tipo: false 
            });
        } finally {
            setIsDeleting(false);
        }
    }, [listUsers]);

    const handleEdit = useCallback((user) => {
        setSelectedUser(user);
        setShowModal(true);
    }, []);

    return (
        <>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Apellido
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Email
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Rol
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Área
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {!users.length ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-4 text-sm text-center text-gray-500">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.cedula} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {user.nombre}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {user.apellido}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {user.rol}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {user.area || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.status === 'Activo' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50"
                                                        title="Editar"
                                                        disabled={isDeleting}
                                                    >
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.cedula)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-200 disabled:opacity-50"
                                                        title="Eliminar"
                                                        disabled={isDeleting}
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && selectedUser && (
                <ModalUpdateUser
                    user={selectedUser}
                    setShowModal={setShowModal}
                    listUsers={listUsers}
                    setMensaje={setMensaje}
                />
            )}
        </>
    );
};

export default TableUsers;
