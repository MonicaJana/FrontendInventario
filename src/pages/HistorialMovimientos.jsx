import axios from 'axios';
import { useState, useEffect } from 'react';
import { EyeIcon,PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Message from '../components/Alerts/Message';

const HistorialMovimientos =() => {

    const [movimientos, setMovimientos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
    const [movimientosFiltrados, setMovimientosFiltrados] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mensaje, setMensaje] = useState({})
    const [modoEdicion, setModoEdicion] = useState(false);
    const [observacionEditada, setObservacionEditada] = useState('');

    const handleEdit = (movimiento) => {
        setMovimientoSeleccionado(movimiento);
        setObservacionEditada(movimiento.observacion || ''); // Mostrar la observación actual para editar
        setModoEdicion(true);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar este movimiento?");
        if (!confirm) return;
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarMovimiento/${id}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url, options);
            await listMovimientos(); // Refresca la lista después de eliminar
        } catch (error) {
            console.log(error);
            alert('Error al eliminar el movimiento');
        }
    };

    const handleGuardarObservacion = async () => {
        // Validación: observación no vacía y mínimo 3 caracteres
        if (!observacionEditada || observacionEditada.trim().length < 3) {
            setMensaje({respuesta: "Debe ingresar una observación válida (mínimo 3 caracteres)", tipo: false});
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarMovimiento/${movimientoSeleccionado._id}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put(url, { observacion: observacionEditada }, options);
            setMensaje({respuesta: "Observación guardada correctamente", tipo: true});
            await listMovimientos();
            setTimeout(() => {
                setModalOpen(false);
                setMovimientoSeleccionado(null);
                setObservacionEditada("");
                setMensaje({});
            }, 1200);
        } catch (error) {
            setMensaje({respuesta: error.response?.data?.msg || "Error al guardar la observación", tipo: false});
        }
    };
    const listMovimientos = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/movimientos`
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
    
            const response = await axios.get(url, options);
            console.log(response.data)
            setMovimientos(response.data)
            setMovimientosFiltrados(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleVerDetalle = (movimiento) => {
        setMovimientoSeleccionado(movimiento);
        setModoEdicion(false);
        setModalOpen(true);
    };

    const filtrarPorFecha = async () => {
        if (!fechaInicio || !fechaFin) {
            setMovimientosFiltrados(movimientos);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/movimientos?desde=${fechaInicio}&hasta=${fechaFin}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(url, options);
            setMovimientosFiltrados(response.data); // Solo actualiza las ventas filtradas
        } catch (error) {
            console.error('Error al filtrar ventas por fecha:', error);
        }
    };

    useEffect(() => {
            listMovimientos();
        },[]);

    return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-black">Historial Movimientos</h1>
        </div>

        <div className="w-full flex flex-col sm:flex-row justify-end mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                    <label htmlFor="fechaInicio" className="block text-xs md:text-sm font-medium text-gray-700">Desde:</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1 text-xs md:text-base"
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <label htmlFor="fechaFin" className="block text-xs md:text-sm font-medium text-gray-700">Hasta:</label>
                    <input
                        type="date"
                        id="fechaFin"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1 text-xs md:text-base"
                    />
                </div>
                <button
                    onClick={filtrarPorFecha}
                    className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Filtrar
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <th className="border px-2 md:px-4 py-2">Fecha</th>
                        <th className="border px-2 md:px-4 py-2">Responsable</th>
                        <th className="border px-2 md:px-4 py-2">Área Salida</th>
                        <th className="border px-2 md:px-4 py-2">Área Llegada</th>
                        <th className="border px-2 md:px-4 py-2">Detalle</th>
                        <th className="border px-2 md:px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientosFiltrados.length === 0 ?(
                        <tr>
                            <td colSpan="6" className="text-center border px-2 md:px-4 py-2 text-sm">
                                No hay registros de movimientos
                            </td>
                        </tr>
                    ): (movimientosFiltrados.map((movimiento) => (
                        <tr key={movimiento._id} className="text-center text-xs md:text-sm">
                            <td className="border px-2 md:px-4 py-2">{new Date(movimiento.fecha).toLocaleString('es-EC')}</td>
                            <td className="border px-2 md:px-4 py-2">{movimiento.responsable[0].nombreResponsable}</td>
                            <td className="border px-2 md:px-4 py-2">{movimiento.areaSalida}</td>
                            <td className="border px-2 md:px-4 py-2">{movimiento.areaLlegada}</td>
                            <td className="border px-2 md:px-4 py-2">
                                <button
                                    onClick={() => handleVerDetalle(movimiento)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Ver detalle"
                                >
                                    <EyeIcon className="w-4 h-4 md:w-5 md:h-5 inline" />
                                </button>
                            </td>
                            <td className="border px-2 md:px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(movimiento)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="w-4 h-4 md:w-5 md:h-5 inline" />
                                </button>
                                <button
                                    onClick={() => handleDelete(movimiento._id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar"
                                >
                                    <TrashIcon className="w-4 h-4 md:w-5 md:h-5 inline" />
                                </button>
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        {modalOpen && movimientoSeleccionado && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
                    <h2 className="text-lg md:text-xl font-bold mb-4 text-black">
                        {modoEdicion ? 'Editar Movimiento' : 'Detalle del Movimiento'}
                    </h2>
                    {Object.keys(mensaje).length > 0 && (
                        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
                    )}

                    <div className="space-y-4">
                        <p className="text-gray-800 mb-1 text-sm md:text-base">
                            <span className="font-semibold">Fecha:</span> {new Date(movimientoSeleccionado.fecha).toLocaleString('es-EC')}
                        </p>
                        <p className="text-gray-800 mb-1 text-sm md:text-base">
                            <span className="font-semibold">Responsable:</span> {movimientoSeleccionado.responsable[0]?.nombreResponsable}
                        </p>
                        <div className="text-gray-800 mb-1">
                            <span className="font-semibold text-sm md:text-base">Observación:</span>
                            {modoEdicion ? (
                                <textarea
                                    className="w-full border border-gray-300 rounded mt-1 px-2 py-1 text-sm md:text-base"
                                    rows="3"
                                    value={observacionEditada}
                                    onChange={(e) => setObservacionEditada(e.target.value)}
                                />
                            ) : (
                                <p className="text-sm md:text-base">{movimientoSeleccionado.observacion}</p>
                            )}
                        </div>
                        <p className="text-gray-800 mb-1 text-sm md:text-base">
                            <span className="font-semibold">Área de Salida:</span> {movimientoSeleccionado.areaSalida}
                        </p>
                        <p className="text-gray-800 mb-1 text-sm md:text-base">
                            <span className="font-semibold">Área Llegada:</span> {movimientoSeleccionado.areaLlegada}
                        </p>
                    </div>

                    {/* Tabla de productos */}
                    {movimientoSeleccionado.productos?.length > 0 && (
                        <>
                        <h3 className="text-base md:text-lg font-semibold text-black mb-2 mt-4">Dispositivos</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-xs md:text-sm mb-4">
                                <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="border px-2 md:px-3 py-1">Nombre</th>
                                    <th className="border px-2 md:px-3 py-1">Código Barras</th>
                                    <th className="border px-2 md:px-3 py-1">Serial</th>
                                    <th className="border px-2 md:px-3 py-1">Capacidad</th>
                                    <th className="border px-2 md:px-3 py-1">Color</th>
                                </tr>
                                </thead>
                                <tbody>
                                {movimientoSeleccionado.productos.map((prod, idx) => (
                                    <tr key={idx} className="text-center">
                                    <td className="border px-2 md:px-3 py-1">{prod.nombreEquipo}</td>
                                    <td className="border px-2 md:px-3 py-1">{prod.codigoBarras}</td>
                                    <td className="border px-2 md:px-3 py-1">{prod.codigoSerial}</td>
                                    <td className="border px-2 md:px-3 py-1">{prod.capacidad}</td>
                                    <td className="border px-2 md:px-3 py-1">{prod.color}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        </>
                    )}

                    {/* Tabla de accesorios */}
                    {movimientoSeleccionado.accesorios?.length > 0 && (
                        <>
                        <h3 className="text-base md:text-lg font-semibold text-black mb-2">Accesorios</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-xs md:text-sm mb-4">
                                <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="border px-2 md:px-3 py-1">Nombre</th>
                                    <th className="border px-2 md:px-3 py-1">Código Barras</th>
                                </tr>
                                </thead>
                                <tbody>
                                {movimientoSeleccionado.accesorios.map((acc, idx) => (
                                    <tr key={idx} className="text-center">
                                    <td className="border px-2 md:px-3 py-1">{acc.nombreAccs}</td>
                                    <td className="border px-2 md:px-3 py-1">{acc.codigoBarrasAccs}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm md:text-base"
                        >
                            Cerrar
                        </button>
                        {modoEdicion && (
                            <button
                                onClick={handleGuardarObservacion}
                                className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-700 text-sm md:text-base"
                            >
                                Guardar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
    )
}

export default HistorialMovimientos;