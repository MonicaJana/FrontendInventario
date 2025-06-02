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
        <div className="p-8 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Historial de Accesorios Ingresados</h1>
            </div>

         <div className="w-full flex justify-end mb-6">
            <div className="flex items-center gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Desde:</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hasta:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </div>
                <button
                    onClick={filtrarPorFecha}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Filtrar
                </button>
            </div>
        </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <th className="border px-4 py-2">Fecha</th>
                        <th className="border px-4 py-2">Responsable</th>
                        <th className="border px-4 py-2">Locación</th>
                        <th className="border px-4 py-2">Accesorio</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Detalle</th>
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
                        <tr key={accesorio._id} className="text-center">
                            <td className="border px-4 py-2">{new Date(accesorio.fechaIngreso).toLocaleString('es-EC')}</td>
                            <td className="border px-4 py-2">{accesorio.responsableAccs[0].nombre}</td>
                            <td className="border px-4 py-2">{accesorio.locacionAccs}</td>
                            <td className="border px-4 py-2">{accesorio.nombreAccs}</td>
                            <td className="border px-4 py-2">{accesorio.precioAccs}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleVerDetalle(accesorio)}  // Pasa el accesorio a editar
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <EyeIcon className="w-5 h-5 inline" />
                                </button>
                            </td>
                        </tr>
                    ))
                    )}
                </tbody>
            </table>
            {modalOpen && accesorioSeleccionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-black">Detalle del Accesorio</h2>

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
                    <p className="text-gray-800 mb-4">
                        <span className="font-semibold">Responsable:</span> {accesorioSeleccionado.responsableAccs?.[0]?.nombre}
                    </p>
                    <div className="text-right">
                        <button
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
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