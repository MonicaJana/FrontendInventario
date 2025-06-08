import { useState, useCallback } from "react";
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalDispositivos from "./Modals/ModalDispositivos";

const TableDispositivos = ({ dispositives, listDispositives }) => {
    const [selectedDispositives, setSelectedDispositives] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = useCallback(async (codigoBarras) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar este dispositivo?");
        if (!confirm) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarProducto/${codigoBarras}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url, options);
            await listDispositives();
        } catch (error) {
            console.error('Error al eliminar dispositivo:', error);
            alert('Error al eliminar el dispositivo. Por favor, intente nuevamente.');
        } finally {
            setIsDeleting(false);
        }
    }, [listDispositives]);

    const handleEdit = useCallback((dispositive) => {
        setSelectedDispositives(dispositive);
        setModalOpen(true);
    }, []);

    const handleAddDispositive = useCallback(() => {
        setModalOpen(false);
        listDispositives();
    }, [listDispositives]);

    return (
        <>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Código de Barra
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Código Serial
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Nombre
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Capacidad
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Color
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Precio
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Tipo
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Estado
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Responsable
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {!dispositives?.productos?.length ? (
                                    <tr>
                                        <td colSpan="10" className="px-4 py-4 text-sm text-center text-gray-500">
                                            No hay dispositivos registrados
                                        </td>
                                    </tr>
                                ) : (
                                    dispositives.productos.map((dispositive) => (
                                        <tr key={dispositive.codigoBarras} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {dispositive.codigoBarras}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {dispositive.codigoSerial}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {dispositive.nombreEquipo}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {dispositive.capacidad}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {dispositive.color}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                ${dispositive.precio}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {dispositive.tipo}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    dispositive.estado === 'Disponible' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {dispositive.estado}
                                                </span>
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {dispositive.responsable[0].nombre}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(dispositive)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50"
                                                        title="Editar"
                                                        disabled={isDeleting}
                                                    >
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(dispositive.codigoBarras)}
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
            
            {modalOpen && selectedDispositives && (
                <ModalDispositivos
                    onClose={() => setModalOpen(false)}
                    listDispositives={listDispositives}
                    dispositive={selectedDispositives}
                    onGuardar={handleAddDispositive}
                />
            )}        
        </>
    );
};

export default TableDispositivos;