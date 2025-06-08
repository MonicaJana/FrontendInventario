import axios from 'axios';
import { useState, useEffect } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

const HistorialIngresosAccesorios =() => {

    const [accesorios, setAccesorios] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    const [accesorioSeleccionado, setAccesorioSeleccionado] = useState(null);
    const [accesoriosFiltrados, setAccesoriosFiltrados] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const listAccesorios = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/accesorios`
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
            const response = await axios.get(url, options);
            console.log(response.data)
            setAccesorios(response.data);
            setAccesoriosFiltrados(response.data); // Mostrar todas al inicio
        } catch (error) {
            console.log(error);
        }
    }

    const handleVerDetalle = (accesorio) => {
        setAccesorioSeleccionado(accesorio);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setAccesorioSeleccionado(null);
    };


    const filtrarPorFecha = async () => {
        if (!fechaInicio || !fechaFin) {
            setAccesoriosFiltrados(accesorios);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/accesorios?desde=${fechaInicio}&hasta=${fechaFin}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(url, options);
            setAccesoriosFiltrados(response.data); // Solo actualiza las ventas filtradas
        } catch (error) {
            console.error('Error al filtrar accesorios por fecha:', error);
        }
    };

    useEffect(() => {
        listAccesorios();
    },[]);

    return(
        <div className="p-4 md:p-8 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-black">Historial de Accesorios Ingresados</h1>
            </div>

            <div className="w-full flex flex-col sm:flex-row justify-end mb-6 space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto">
                        <label className="block text-xs md:text-sm font-medium text-gray-700">Desde:</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1 text-xs md:text-base"
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <label className="block text-xs md:text-sm font-medium text-gray-700">Hasta:</label>
                        <input
                            type="date"
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
                            <th className="border px-2 md:px-4 py-2">Locación</th>
                            <th className="border px-2 md:px-4 py-2">Accesorio</th>
                            <th className="border px-2 md:px-4 py-2">Precio</th>
                            <th className="border px-2 md:px-4 py-2">Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accesoriosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center border px-4 py-2">
                                    No hay registros de ingresos
                                </td>
                            </tr>
                        ) : (accesoriosFiltrados.map((accesorio) => (
                            <tr key={accesorio._id} className="text-center text-sm md:text-base">
                                <td className="border px-2 md:px-4 py-2">{new Date(accesorio.fechaIngreso).toLocaleString('es-EC')}</td>
                                <td className="border px-2 md:px-4 py-2">{accesorio.responsableAccs[0].nombre}</td>
                                <td className="border px-2 md:px-4 py-2">{accesorio.locacionAccs}</td>
                                <td className="border px-2 md:px-4 py-2">{accesorio.nombreAccs}</td>
                                <td className="border px-2 md:px-4 py-2">${accesorio.precioAccs}</td>
                                <td className="border px-2 md:px-4 py-2">
                                    <button
                                        onClick={() => handleVerDetalle(accesorio)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Ver detalle"
                                    >
                                        <EyeIcon className="w-5 h-5 inline" />
                                    </button>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>

            {modalOpen && accesorioSeleccionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
                        <h2 className="text-lg md:text-xl font-bold mb-4 text-black">Detalle del Accesorio</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Nombre:</span> {accesorioSeleccionado.nombreAccs}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Código de Barras:</span> {accesorioSeleccionado.codigoBarrasAccs}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Código Modelo:</span> {accesorioSeleccionado.codigoModeloAccs}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Fecha de Ingreso:</span> {new Date(accesorioSeleccionado.fechaIngreso).toLocaleString('es-EC')}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Precio:</span> ${accesorioSeleccionado.precioAccs}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Disponibilidad:</span> {accesorioSeleccionado.disponibilidadAccs}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Locación:</span> {accesorioSeleccionado.locacionAccs}
                            </p>
                            <p className="text-gray-800 mb-1">
                                <span className="font-semibold">Responsable:</span> {accesorioSeleccionado.responsableAccs?.[0]?.nombre}
                            </p>
                        </div>

                        <div className="text-right mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
                            >
                                Cerrar
                            </button>
                        </div> 
                    </div> 
                </div>
            )}
        </div>
    );
}

export default HistorialIngresosAccesorios;