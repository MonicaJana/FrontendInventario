import { useState} from "react";
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalDispositivos from "./Modals/ModalDispositivos";

const TableDispositivos = ({dispositives, listDispositives}) => {

    const [selectedDispositives, setSelectedDispositives] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    console.log(dispositives)
    const handleDelete = async (codigoBarras) =>{
        const confirm = window.confirm("¿Estás seguro que deseas eliminar este dispositivo?");
        if (!confirm) return;

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
            listDispositives();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (dispositive) => {
        setSelectedDispositives(dispositive);  // Establece el accesorio seleccionado
        setModalOpen(true);  // Abre el modal
    };

    const handleAddDispositive = (newDispositive) => {
        setModalOpen(false);  // Cierra el modal después de guardar
        listDispositives();  // Actualiza la lista de accesorios
    };

    return (
        <>
                    <table className="table-auto w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <th className="border px-4 py-2">Código de Barra</th>
                       {/* <th className="border px-4 py-2">Código Único</th>*/}
                        <th className="border px-4 py-2">Código Serial</th>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Capacidad</th>
                        <th className="border px-4 py-2">Color</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Tipo</th>
                        <th className="border px-4 py-2">Estado</th>
                       {/* <th className="border px-4 py-2">Locación</th>
                        <th className="border px-4 py-2">Fecha Ingreso</th>*/}
                        <th className="border px-4 py-2">Responsable</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {dispositives?.productos?.map((dispositive) => (
                        <tr key={dispositive.codigoBarras} className="text-center">
                            <td className="border px-4 py-2">{dispositive.codigoBarras}</td>
                            {/*<td className="border px-4 py-2">{dispositive.codigoUnico}</td>*/}
                            <td className="border px-4 py-2">{dispositive.codigoSerial}</td>
                            <td className="border px-4 py-2">{dispositive.nombreEquipo}</td>
                            <td className="border px-4 py-2">{dispositive.capacidad}</td>
                            <td className="border px-4 py-2">{dispositive.color}</td>
                            <td className="border px-4 py-2">{dispositive.precio}</td>
                            <td className="border px-4 py-2">{dispositive.tipo}</td>
                            <td className="border px-4 py-2">{dispositive.estado}</td>
                            {/*<td className="border px-4 py-2">{dispositive.locacion}</td>
                            <td className="border px-4 py-2"> {new Date(dispositive.fechaIngreso).toLocaleString('es-EC')}</td> */}
                            <th className="border px-4 py-2">{dispositive.responsable[0].nombre}</th>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(dispositive)}  // Pasa el accesorio a editar
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="w-5 h-5 inline" />
                                </button>
                                <button
                                    onClick={() => handleDelete(dispositive.codigoBarras)}
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
            {modalOpen && selectedDispositives && (
                <ModalDispositivos
                    onClose={() => setModalOpen(false)}
                    listDispositives={listDispositives}
                    dispositive={selectedDispositives}
                    onGuardar={handleAddDispositive}
                />
            )}        
        </>
    )

};

export default TableDispositivos;