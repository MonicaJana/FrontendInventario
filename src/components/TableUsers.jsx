import { useState} from "react";
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalUpdateUser from "./Modals/ModalUpdateUser";

const TableUsers = ({users,listUsers}) => {

    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState({});
    
    const handleDelete = async (cedula) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar este usuario?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/users/${cedula}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url,options);
            listUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    }

    return (
        <>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Apellido</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Rol</th>
                        <th className="border px-4 py-2">Área</th>
                        <th className="border px-4 py-2">Estado</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.cedula} className="text-center">
                            <td className="border px-4 py-2">{user.nombre}</td>
                            <td className="border px-4 py-2">{user.apellido}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.rol}</td>
                            <td className="border px-4 py-2">{user.area || 'N/A'}</td>
                            <td className="border px-4 py-2">{user.status}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="w-5 h-5 inline" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.cedula)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar"
                                >
                                    <TrashIcon className="w-5 h-5 inline" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && selectedUser && (
                <ModalUpdateUser
                user={selectedUser}
                setShowModal={setShowModal}
                listUsers={listUsers}
                setMensaje={setMensaje}/>
            )}
        </>
    );
};

export default TableUsers;
