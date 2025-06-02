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
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <th className="border px-4 py-2">Código de Barra</th>
                        {/*<th className="border px-4 py-2">Código Único</th>*/}
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Estado</th>
                        <th className="border px-4 py-2">Responsable</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {accesories.map((accesory) => (
                        <tr key={accesory.codigoBarrasAccs} className="text-center">
                            <td className="border px-4 py-2">{accesory.codigoBarrasAccs}</td>
                            {/*<td className="border px-4 py-2">{accesory.codigoUnicoAccs}</td> */}
                            <td className="border px-4 py-2">{accesory.nombreAccs}</td>
                            <td className="border px-4 py-2">{accesory.precioAccs}</td>
                            <td className="border px-4 py-2">{accesory.disponibilidadAccs}</td>
                            <td className="border px-4 py-2">{accesory.responsableAccs[0].nombre}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(accesory)}  // Pasa el accesorio a editar
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="w-5 h-5 inline" />
                                </button>
                                <button
                                    onClick={() => handleDelete(accesory.codigoBarrasAccs)}
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