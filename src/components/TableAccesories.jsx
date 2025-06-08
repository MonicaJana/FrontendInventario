import { useState } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalAccesory from "./Modals/ModalAccesory";

const TableAccesories = ({ accesories, listAccesories }) => {
    const [selectedAccesories, setSelectedAccesory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async (codigoBarras) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar este accesorio?");
        if (!confirm) return;

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarAccesorio/${codigoBarras}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            
            await axios.delete(url, options);
            await listAccesories();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al eliminar el accesorio');
            console.error('Error al eliminar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (accesory) => {
        if (!accesory) return;
        setSelectedAccesory(accesory);
        setModalOpen(true);
    };

    const handleAddAccesory = async (newAccesory) => {
        try {
            await listAccesories();
            setModalOpen(false);
        } catch (error) {
            console.error('Error al actualizar la lista:', error);
        }
    };

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                {error}
            </div>
        );
    }

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
                    <tbody className={`bg-white divide-y divide-gray-200 ${isLoading ? 'opacity-50' : ''}`}>
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
                                    {accesory.responsableAccs[0]?.nombre || 'No asignado'}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleEdit(accesory)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50"
                                            title="Editar"
                                            disabled={isLoading}
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(accesory.codigoBarrasAccs)}
                                            className="text-red-600 hover:text-red-800 transition-colors duration-200 disabled:opacity-50"
                                            title="Eliminar"
                                            disabled={isLoading}
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

TableAccesories.propTypes = {
    accesories: PropTypes.arrayOf(
        PropTypes.shape({
            codigoBarrasAccs: PropTypes.string.isRequired,
            nombreAccs: PropTypes.string.isRequired,
            precioAccs: PropTypes.number.isRequired,
            disponibilidadAccs: PropTypes.string.isRequired,
            responsableAccs: PropTypes.arrayOf(
                PropTypes.shape({
                    nombre: PropTypes.string.isRequired
                })
            ).isRequired
        })
    ).isRequired,
    listAccesories: PropTypes.func.isRequired
};

export default TableAccesories;