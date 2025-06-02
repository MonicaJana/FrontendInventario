import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { EyeIcon,PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import AuthContext from '../context/AuthProvider';
import Message from '../components/Alerts/Message';

const HistorialVentas =() => {

    const {auth} = useContext(AuthContext)
    const [ventas, setVentas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [observacionEditada, setObservacionEditada] = useState("");
    const [metodoPagoEditado, setMetodoPagoEditado] = useState("");
    const [numeroDocumentoEditado, setNumeroDocumentoEditado] = useState("");
    const [descripcionDocumentoEditado, setDescripcionDocumentoEditado] = useState("");
    const [mensaje, setMensaje] = useState({})

    const listVentas = async () => {
        try {
            const token = localStorage.getItem('token');
            const url =
                 auth?.rol === "Vendedor"
                ? `${import.meta.env.VITE_BACKEND_URL}/listarVentasVendedor`
                : `${import.meta.env.VITE_BACKEND_URL}/ventas`;
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
    
            const response = await axios.get(url, options);
            setVentas(response.data);
            setVentasFiltradas(response.data); // Mostrar todas al inicio
        } catch (error) {
            console.log(error);
        }
    }

    const handleVerDetalle = (venta) => {
        setVentaSeleccionada(venta);
        setModoEdicion(false);
        setMensaje({});
        setModalOpen(true);
    };

    const handleEdit = (venta) => {
        setVentaSeleccionada(venta);
        setObservacionEditada(venta.observacion || "");
        setMetodoPagoEditado(venta.metodoPago || "");
        setNumeroDocumentoEditado(venta.numeroDocumento || "");
        setDescripcionDocumentoEditado(venta.descripcionDocumento || "");
        setModoEdicion(true);
        setMensaje({});
        setModalOpen(true);
    };

    const handleGuardarEdicion = async () => {
        if (!observacionEditada || observacionEditada.trim().length < 3) {
            setMensaje({respuesta: "Debe ingresar una observación válida (mínimo 3 caracteres)", tipo: false});
            return;
        }
        if (!metodoPagoEditado) {
            setMensaje({respuesta: "Debe seleccionar un método de pago", tipo: false});
            return;
        }
        if ((metodoPagoEditado === "Transferencia" || metodoPagoEditado === "Tarjeta") && (!numeroDocumentoEditado || !descripcionDocumentoEditado)) {
            setMensaje({respuesta: "Debe ingresar número y descripción de documento para el método seleccionado", tipo: false});
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarVenta/${ventaSeleccionada._id}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put(url, {
                observacion: observacionEditada,
                metodoPago: metodoPagoEditado,
                numeroDocumento: metodoPagoEditado === "Transferencia" || metodoPagoEditado === "Tarjeta" ? numeroDocumentoEditado : undefined,
                descripcionDocumento: metodoPagoEditado === "Transferencia" || metodoPagoEditado === "Tarjeta" ? descripcionDocumentoEditado : undefined
            }, options);
            setMensaje({respuesta: "Venta actualizada correctamente", tipo: true});
            await listVentas();
            setTimeout(() => {
                setModalOpen(false);
                setVentaSeleccionada(null);
                setModoEdicion(false);
                setMensaje({});
            }, 1200);
        } catch (error) {
            setMensaje({respuesta: error.response?.data?.msg || "Error al actualizar la venta", tipo: false});
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar esta venta?");
        if (!confirm) return;
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarVenta/${id}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url, options);
            setMensaje({respuesta: "Venta eliminada correctamente", tipo: true});
            await listVentas();
            setTimeout(() => {
                setModalOpen(false);
                setVentaSeleccionada(null);
                setMensaje({});
            }, 1200);
        } catch (error) {
            setMensaje({respuesta: error.response?.data?.msg || "Error al eliminar la venta", tipo: false});
        }
    };

    const filtrarPorFecha = async () => {
        if (!fechaInicio || !fechaFin) {
            setVentasFiltradas(ventas);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = auth?.rol ==="Vendedor"
            ? `${import.meta.env.VITE_BACKEND_URL}/listarVentasVendedor?desde=${fechaInicio}&hasta=${fechaFin}`:
            `${import.meta.env.VITE_BACKEND_URL}/ventas?desde=${fechaInicio}&hasta=${fechaFin}`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(url, options);
            setVentasFiltradas(response.data); // Solo actualiza las ventas filtradas
        } catch (error) {
            console.error('Error al filtrar ventas por fecha:', error);
        }
    };

    useEffect(() => {
        listVentas();
    },[auth]);

    return(
        <div className="p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Historial Ventas</h1>
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
                        <th className="border px-4 py-2">Vendedor</th>
                        <th className="border px-4 py-2">Método Pago</th>
                        <th className="border px-4 py-2">Descuento</th>
                        <th className="border px-4 py-2">Total</th>
                        <th className="border px-4 py-2">Detalle</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventasFiltradas.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center border px-4 py-2">
                                No hay registros de ventas
                            </td>
                        </tr>
                    ) : (ventasFiltradas.map((venta) => (
                        <tr key={venta._id} className="text-center">
                            <td className="border px-4 py-2">{new Date(venta.fecha).toLocaleString('es-EC')}</td>
                            <td className="border px-4 py-2">{venta.vendedor[0].nombreVendedor}</td>
                            <td className="border px-4 py-2">{venta.metodoPago}</td>
                            <td className="border px-4 py-2">{venta.descuento}</td>
                            <td className="border px-4 py-2">{venta.total}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleVerDetalle(venta)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Ver Detalle"
                                >
                                    <EyeIcon className="w-5 h-5 inline" />
                                </button>
                            </td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(venta)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="w-5 h-5 inline" />
                                </button>
                                {
		                            (auth.rol === "Administrador")&&
		                        (
                                <button
                                    onClick={() => handleDelete(venta._id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar"
                                >
                                    <TrashIcon className="w-5 h-5 inline" />
                                </button>
                                )}
                            </td>
                        </tr>
                    ))
                    )}
                </tbody>
            </table>
            {modalOpen && ventaSeleccionada && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-black">{modoEdicion ? 'Editar Venta' : 'Detalle de Venta'}</h2>
                    {Object.keys(mensaje).length > 0 && (
                        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
                    )}
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Cliente:</span> {ventaSeleccionada.cliente?.nombre} ({ventaSeleccionada.cliente?.cedula})
                    </p>
                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Vendedor:</span> {ventaSeleccionada.vendedor[0]?.nombreVendedor}
                    </p>
                    <div className="text-gray-800 mb-1">
                        <span className="font-semibold">Observación:</span>
                        {modoEdicion ? (
                            <textarea
                                className="w-full border border-gray-300 rounded mt-1 px-2 py-1"
                                rows="3"
                                value={observacionEditada}
                                onChange={(e) => setObservacionEditada(e.target.value)}
                            />
                        ) : (
                            <span> {ventaSeleccionada.observacion}</span>
                        )}
                    </div>
                    <div className="text-gray-800 mb-1">
                        <span className="font-semibold">Método de Pago:</span>
                        {modoEdicion ? (
                            <select
                                className="w-full border border-gray-300 rounded mt-1 px-2 py-1"
                                value={metodoPagoEditado}
                                onChange={(e) => setMetodoPagoEditado(e.target.value)}
                            >
                                <option value="">Seleccione</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                        ) : (
                            <span> {ventaSeleccionada.metodoPago}</span>
                        )}
                    </div>
                    {!modoEdicion && (ventaSeleccionada.metodoPago === "Transferencia" || ventaSeleccionada.metodoPago === "Tarjeta") && (
                        <>
                            <p className="text-gray-800 mb-1">
                            <span className="font-semibold">Número de Documento:</span> {ventaSeleccionada.numeroDocumento || "No registrado"}
                            </p>
                            <p className="text-gray-800 mb-1">
                            <span className="font-semibold">Descripción del Documento:</span> {ventaSeleccionada.descripcionDocumento || "No registrado"}
                            </p>
                        </>
                        )}


                    <p className="text-gray-800 mb-1">
                        <span className="font-semibold">Descuento:</span> ${ventaSeleccionada.descuento}
                    </p>
                    <p className="text-gray-800 mb-4">
                        <span className="font-semibold">Total:</span> ${ventaSeleccionada.total}
                    </p>

                    {/* Tabla de productos */}
                    {ventaSeleccionada.productos?.length > 0 && (
                        <>
                        <h3 className="text-lg font-semibold text-black mb-2">Dispositivos</h3>
                        <table className="w-full border-collapse text-sm mb-4">
                            <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border px-3 py-1">Nombre</th>
                                <th className="border px-3 py-1">Código Barras</th>
                                <th className="border px-3 py-1">Serial</th>
                                <th className="border px-3 py-1">Capacidad</th>
                                <th className="border px-3 py-1">Color</th>
                                <th className="border px-3 py-1">Precio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ventaSeleccionada.productos.map((prod, idx) => (
                                <tr key={idx} className="text-center">
                                <td className="border px-3 py-1">{prod.nombreEquipo}</td>
                                <td className="border px-3 py-1">{prod.codigoBarras}</td>
                                <td className="border px-3 py-1">{prod.codigoSerial}</td>
                                <td className="border px-3 py-1">{prod.capacidad}</td>
                                <td className="border px-3 py-1">{prod.color}</td>
                                <td className="border px-3 py-1">${prod.precioUnitario}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </>
                    )}

                    {/* Tabla de accesorios */}
                    {ventaSeleccionada.accesorios?.length > 0 && (
                        <>
                        <h3 className="text-lg font-semibold text-black mb-2">Accesorios</h3>
                        <table className="w-full border-collapse text-sm mb-4">
                            <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border px-3 py-1">Nombre</th>
                                <th className="border px-3 py-1">Código Barras</th>
                                <th className="border px-3 py-1">Precio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ventaSeleccionada.accesorios.map((acc, idx) => (
                                <tr key={idx} className="text-center">
                                <td className="border px-3 py-1">{acc.nombreAccs}</td>
                                <td className="border px-3 py-1">{acc.codigoBarrasAccs}</td>
                                <td className="border px-3 py-1">${acc.precioUnitario}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </>
                    )}

                    <div className="text-right flex gap-2 justify-end mt-4">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                        >
                            Cerrar
                        </button>
                        {modoEdicion && (
                            <button
                                onClick={handleGuardarEdicion}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
                            >
                                Guardar
                            </button>
                        )}
                    </div>
                    </div>
                </div>
                )}

        </div>
    );
}

export default HistorialVentas;