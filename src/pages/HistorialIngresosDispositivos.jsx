import axios from 'axios';
import { useState, useEffect } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

const HistorialIngresosDispositivos =() => {

    const [dispositivos, setDispositivos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
    const [dispositivosFiltrados, setDispositivosFiltrados] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const listDispositivos = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = 'http://localhost:3000/gt/productos'
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
            const response = await axios.get(url, options);
            console.log(response.data)
            setDispositivos(response.data);
            setDispositivosFiltrados(response.data); // Mostrar todas al inicio
        } catch (error) {
            console.log(error);
        }
    }

    const handleVerDetalle = (dispositivo) => {
        setDispositivoSeleccionado(dispositivo);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setDispositivoSeleccionado(null);
    };


    const filtrarPorFecha = async () => {
        if (!fechaInicio || !fechaFin) {
            setDispositivosFiltrados(dispositivos);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos?desde=${fechaInicio}&hasta=${fechaFin}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(url, options);
            setDispositivosFiltrados(response.data); // Solo actualiza las ventas filtradas
        } catch (error) {
            console.error('Error al filtrar ventas por fecha:', error);
        }
    };

    useEffect(() => {
        listDispositivos();
    },[]);

    return(
        <div className="p-8 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Historial de Dispositivos Ingresados</h1>
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
                        <th className="border px-4 py-2">Equipo</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    {dispositivosFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center border px-4 py-2">
                                No hay registros de ingresos
                            </td>
                        </tr>
                    ) : (dispositivosFiltrados.map((dispositivo) => (
                        <tr key={dispositivo._id} className="text-center">
                            <td className="border px-4 py-2">{new Date(dispositivo.fechaIngreso).toLocaleString('es-EC')}</td>
                            <td className="border px-4 py-2">{dispositivo.responsable[0].nombre}</td>
                            <td className="border px-4 py-2">{dispositivo.locacion}</td>
                            <td className="border px-4 py-2">{dispositivo.nombreEquipo}</td>
                            <td className="border px-4 py-2">{dispositivo.precio}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleVerDetalle(dispositivo)}  // Pasa el accesorio a editar
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
            {modalOpen && dispositivoSeleccionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-black">Detalle del Dispositivo</h2>

                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Nombre del Equipo:</span> {dispositivoSeleccionado.nombreEquipo}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Código de Barras:</span> {dispositivoSeleccionado.codigoBarras}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Código Serial:</span> {dispositivoSeleccionado.codigoSerial}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Código Modelo:</span> {dispositivoSeleccionado.codigoModelo}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Capacidad:</span> {dispositivoSeleccionado.capacidad}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Color:</span> {dispositivoSeleccionado.color}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Tipo:</span> {dispositivoSeleccionado.tipo}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Precio:</span> ${dispositivoSeleccionado.precio}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Estado:</span> {dispositivoSeleccionado.estado}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Fecha de Ingreso:</span> {new Date(dispositivoSeleccionado.fechaIngreso).toLocaleString('es-EC')}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Locación:</span> {dispositivoSeleccionado.locacion}
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Categoría:</span> {dispositivoSeleccionado.categoriaNombre?.[0]?.nombreCategoria}
                    </p>
                    <p className="text-gray-800 mb-4">
                        <span className="font-semibold">Responsable:</span> {dispositivoSeleccionado.responsable?.[0]?.nombre}
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

export default HistorialIngresosDispositivos;