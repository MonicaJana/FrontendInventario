import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Message from "../components/Alerts/Message"

const RegistrarVentas = () => {
  const initialFormState = {
    cliente: { cedula: "", nombre: "" },
    metodoPago: "",
    observacion: "",
    productos: [],
    accesorios: [],
    descuento: 0,
    numeroDocumento: "",
    descripcionDocumento: ""
  };

  const [form, setForm] = useState(initialFormState);
  const [mensaje, setMensaje] = useState({});
  const [productoInput, setProductoInput] = useState("");
  const [accesorioInput, setAccesorioInput] = useState("");
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar mensaje después de 3 segundos
  useEffect(() => {
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [mensaje]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name.startsWith("cliente.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        cliente: { ...prev.cliente, [field]: value.trim() }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const actualizarTotal = useCallback((productos, accesorios, descuento = 0) => {
    const totalProductos = productos.reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
    const totalAccesorios = accesorios.reduce((sum, a) => sum + parseFloat(a.precioAccs || 0), 0);
    const subtotal = totalProductos + totalAccesorios;
    const totalConDescuento = subtotal - descuento;
    const totalFinal = Math.max(totalConDescuento, 0);

    setTotal(totalFinal);
    return totalFinal;
  }, []);

  const addProducto = useCallback(async () => {
    if (!productoInput.trim()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/listarProducto/${productoInput}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(url, options);
      const data = response.data.producto;
      
      setForm((prev) => {
        const nuevosProductos = [
          ...prev.productos,
          {
            codigoBarras: data.codigoBarras,
            codigoSerial: data.codigoSerial,
            nombreEquipo: data.nombreEquipo,
            color: data.color,
            capacidad: data.capacidad,
            precio: data.precio,
          },
        ];

        const nuevoTotal = actualizarTotal(nuevosProductos, prev.accesorios, prev.descuento);

        return {
          ...prev,
          productos: nuevosProductos,
          total: nuevoTotal,
        };
      });
      setProductoInput("");
    } catch (error) {
      setMensaje({ 
        respuesta: "No se pudo encontrar el dispositivo", 
        tipo: false 
      });
    } finally {
      setIsLoading(false);
    }
  }, [productoInput, actualizarTotal]);

  const addAccesorio = useCallback(async () => {
    if (!accesorioInput.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/listarAccesorio/${accesorioInput}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(url, options);
      const data = response.data.accesorio;
      
      setForm((prev) => {
        const nuevosAccesorios = [
          ...prev.accesorios, 
          { 
            codigoBarrasAccs: data.codigoBarrasAccs,
            nombreAccs: data.nombreAccs,
            precioAccs: data.precioAccs
          }
        ];

        const nuevoTotal = actualizarTotal(prev.productos, nuevosAccesorios, prev.descuento);

        return {
          ...prev,
          accesorios: nuevosAccesorios,
          total: nuevoTotal,
        };   
      });
      setAccesorioInput("");
    } catch (error) {
      setMensaje({ 
        respuesta: "No se pudo encontrar el accesorio", 
        tipo: false 
      });
    } finally {
      setIsLoading(false);
    }
  }, [accesorioInput, actualizarTotal]);

  const deleteProducto = useCallback((codigoBarras) => {
    setForm((prev) => {
      const nuevosProductos = prev.productos.filter(
        (producto) => producto.codigoBarras !== codigoBarras
      );
      const nuevoTotal = actualizarTotal(nuevosProductos, prev.accesorios, prev.descuento);
      return {
        ...prev,
        productos: nuevosProductos,
        total: nuevoTotal,
      };
    });
  }, [actualizarTotal]);

  const deleteAccesorio = useCallback((codigoBarrasAccs) => {
    setForm((prev) => {
      const nuevosAccesorios = prev.accesorios.filter(
        (accesorio) => accesorio.codigoBarrasAccs !== codigoBarrasAccs
      );
      const nuevoTotal = actualizarTotal(prev.productos, nuevosAccesorios, prev.descuento);
      return {
        ...prev,
        accesorios: nuevosAccesorios,
        total: nuevoTotal,
      };
    });
  }, [actualizarTotal]);

  const handleDescuentoChange = useCallback((e) => {
    const nuevoDescuento = Math.max(parseFloat(e.target.value) || 0, 0);
    setForm((prev) => {
      const nuevoTotal = actualizarTotal(prev.productos, prev.accesorios, nuevoDescuento);
      return {
        ...prev,
        descuento: nuevoDescuento,
        total: nuevoTotal,
      };
    });
  }, [actualizarTotal]);

  const validarFormulario = useCallback(() => {
    if (!form.cliente.cedula || !form.cliente.nombre || !form.metodoPago) {
      setMensaje({ respuesta: "Cédula, nombre del cliente y método de pago son obligatorios", tipo: false });
      return false;
    }
    if (!/^\d{10}$/.test(form.cliente.cedula)) {
      setMensaje({ respuesta: "La cédula debe tener exactamente 10 dígitos numéricos", tipo: false });
      return false;
    }
    if (form.cliente.nombre.trim().length < 3) {
      setMensaje({ respuesta: "El nombre del cliente debe tener al menos 3 caracteres", tipo: false });
      return false;
    }
    if (form.productos.length === 0 && form.accesorios.length === 0) {
      setMensaje({ respuesta: "Debe agregar al menos un dispositivo o accesorio a la venta", tipo: false });
      return false;
    }
    if ((form.metodoPago === "Transferencia" || form.metodoPago === "Tarjeta") &&
        (!form.numeroDocumento || !form.descripcionDocumento)) {
      setMensaje({ respuesta: "Debe ingresar número y descripción de documento para el método seleccionado", tipo: false });
      return false;
    }
    if (form.descuento < 0) {
      setMensaje({ respuesta: "El descuento no puede ser negativo", tipo: false });
      return false;
    }
    return true;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const confirmacion = window.confirm("¿Estás seguro de que deseas registrar esta venta?");
    if (!confirmacion) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/registrarVenta`, form, options); 
      setMensaje({ respuesta: res.data.msg, tipo: true });
      
      // Resetear el formulario
      setForm(initialFormState);
      setProductoInput("");
      setAccesorioInput("");
      setTotal(0);
    } catch (error) {
      setMensaje({ 
        respuesta: error.response?.data?.msg || "Error al registrar la venta", 
        tipo: false 
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-black">Registrar Venta</h1>
      </div>

      {Object.keys(mensaje).length > 0 && (
        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Información del Cliente */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Cédula del Cliente</label>
            <input
              type="text"
              value={form.cliente.cedula}
              onChange={handleChange}
              name="cliente.cedula"
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Ingrese la cédula del cliente"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
            <input
              type="text"
              value={form.cliente.nombre}
              onChange={handleChange}
              name="cliente.nombre"
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Ingrese el nombre del cliente"
            />
          </div>
        </div>

        {/* Método de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
            <select
              value={form.metodoPago}
              onChange={handleChange}
              name="metodoPago"
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          {(form.metodoPago === "Transferencia" || form.metodoPago === "Tarjeta") && (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Número de Documento</label>
                <input
                  type="text"
                  value={form.numeroDocumento}
                  onChange={handleChange}
                  name="numeroDocumento"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Ingrese número de documento"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción del Documento</label>
                <input
                  type="text"
                  value={form.descripcionDocumento}
                  onChange={handleChange}
                  name="descripcionDocumento"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Ingrese descripción"
                />
              </div>
            </>
          )}
        </div>

        {/* Observación */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Observación</label>
          <textarea
            value={form.observacion}
            onChange={handleChange}
            name="observacion"
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent min-h-[100px]"
            placeholder="Ingrese la observación"
          />
        </div>

        {/* Dispositivos */}
        <div className="w-full space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full">
              <label className="text-sm font-bold text-black">Código del dispositivo</label>
              <input
                type="text"
                value={productoInput}
                onChange={(e) => setProductoInput(e.target.value)}
                name="itemInput"
                placeholder="Ingrese código de barras del dispositivo"
                className="w-full p-2 rounded border text-lefth"
              />
            </div>
            <button
              type="button"
              onClick={addProducto}
              className="w-full md:w-auto bg-black hover:bg-gray-700 text-white p-2 rounded"
            >
              <PlusIcon className="h-5 w-5 mx-auto" />
            </button>
          </div>
        </div>

        {/* Tabla de Dispositivos */}
        {form.productos.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Dispositivos Agregados</h2>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Código de Barras</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Código Serial</th>
                        <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nombre</th>
                        <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Color</th>
                        <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Capacidad</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Precio</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {form.productos.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.codigoBarras}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.codigoSerial}</td>
                          <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.nombreEquipo}</td>
                          <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.color}</td>
                          <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.capacidad}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">${item.precio}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => deleteProducto(item.codigoBarras)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accesorios */}
        <div className="w-full space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full">
              <label className="text-sm font-bold text-black">Código del accesorio</label>
              <input
                type="text"
                value={accesorioInput}
                onChange={(e) => setAccesorioInput(e.target.value)}
                name="accesorioInput"
                placeholder="Ingrese código de barras del accesorio"
                className="w-full p-2 rounded border text-lefth"
              />
            </div>
            <button
              type="button"
              onClick={addAccesorio}
              className="w-full md:w-auto bg-black hover:bg-gray-700 text-white p-2 rounded"
            >
              <PlusIcon className="h-5 w-5 mx-auto" />
            </button>
          </div>
        </div>

        {/* Tabla de Accesorios */}
        {form.accesorios.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Accesorios Agregados</h2>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Código de Barras</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nombre</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Precio</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {form.accesorios.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.codigoBarrasAccs}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.nombreAccs}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">${item.precioAccs}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => deleteAccesorio(item.codigoBarrasAccs)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total y Descuento */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-4 gap-4">
          <div className="w-full md:w-1/3">
            <label className="text-sm font-bold text-black block mb-1">Descuento</label>
            <input
              type="number"
              value={form.descuento}
              onChange={handleDescuentoChange}
              name="descuento"
              className="w-full p-2 rounded border text-right text-sm"
              placeholder="Ingrese descuento"
            />
          </div>

          <div className="w-full md:w-2/3 text-left md:text-right">
            <h3 className="text-lg font-semibold">
              Total a pagar: <span className="text-black">${total.toFixed(2)}</span>
            </h3>
          </div>
        </div>

        {/* Botón submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full md:w-auto bg-black hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold"
          >
            REGISTRAR VENTA
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarVentas;
