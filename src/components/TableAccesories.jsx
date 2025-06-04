import { useState} from "react";
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalAccesory from "./Modals/ModalAccesory";

const TableAccesories = ({ accesories, listAccesories }) => {
    const [selectedAccesories, setSelectedAccesory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = async (codigoBarras) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar este accesorio?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarAccesorio/${codigoBarras}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url, options);
            listAccesories();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (accesory) => {
        setSelectedAccesory(accesory);  // Establece el accesorio seleccionado
        setModalOpen(true);  // Abre el modal
    };

    const handleAddAccesory = (newAccesory) => {
        setModalOpen(false);  // Cierra el modal después de guardar
        listAccesories();  // Actualiza la lista de accesorios
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Código de Barra
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Nombre
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Precio
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Estado
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Responsable
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {accesories.map((accesory) => (
                            <tr key={accesory.codigoBarrasAccs} className="hover:bg-gray-50">
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {accesory.codigoBarrasAccs}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {accesory.nombreAccs}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    ${accesory.precioAccs}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        accesory.disponibilidadAccs === 'Disponible' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {accesory.disponibilidadAccs}
                                    </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {accesory.responsableAccs[0].nombre}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleEdit(accesory)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                            title="Editar"
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(accesory.codigoBarrasAccs)}
                                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && selectedAccesories && (
                <ModalAccesory
                    onClose={() => setModalOpen(false)}
                    listAccesories={listAccesories}
                    accesory={selectedAccesories}
                    onGuardar={handleAddAccesory}
                />
            )}
        </>
    );
};

export default TableAccesories;