import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import axios from "axios";
import Message from "../components/Alerts/Message"

const RegistrarVentas = () => {
  const [form, setForm] = useState({
    cliente: { cedula: "", nombre: "" },
    metodoPago: "",
    observacion: "",
    productos: [],
    accesorios: [],
    descuento: 0,
    numeroDocumento: "",
    descripcionDocumento: ""
  });
  const [mensaje, setMensaje] = useState({});
  const [productoInput, setProductoInput] = useState("");
  const [accesorioInput, setAccesorioInput] = useState("");
  const [total, setTotal] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("cliente.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        cliente: { ...prev.cliente, [field]: value }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addProducto = async () => {
  if (productoInput.trim() !== "") {
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

      console.log(data)
      // Agrega el producto completo completo
      
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

        // Actualiza el total usando la función
        const nuevoTotal = actualizarTotal(nuevosProductos, prev.accesorios, prev.descuento);

        return {
          ...prev,
          productos: nuevosProductos,
          total: nuevoTotal,
        };
        });
      setProductoInput("");
    } catch (error) {
      console.error("Error al buscar dispositivo", error.response?.data || error.message);
      alert("No se pudo encontrar el dispositivo.");
    }
  }
};

  const addAccesorio = async () => {
    if (accesorioInput.trim() !== "") {

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
      console.log(data)
      
      //Agregar el accesorio completo
      setForm((prev) => {
        const nuevosAccesorios = 
        [...prev.accesorios, 
          { 
          codigoBarrasAccs: data.codigoBarrasAccs,
          nombreAccs: data.nombreAccs,
          precioAccs: data.precioAccs
        }];

        const nuevoTotal = actualizarTotal(prev.productos, nuevosAccesorios, prev.descuento);

        return {
          ...prev,
          accesorios: nuevosAccesorios,
          total: nuevoTotal,
        };   
      });
      setAccesorioInput("")
      } catch (error) {
        console.error("Error al buscar accesorio", error.response?.data || error.message);
      alert("No se pudo encontrar el accesorio.");
        
      }
    }
  };

  const deleteProducto = (codigoBarras) => {
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
  };

  const deleteAccesorio = (codigoBarrasAccs) => {
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
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones antes de confirmar
    if (!form.cliente.cedula || !form.cliente.nombre || !form.metodoPago) {
      setMensaje({ respuesta: "Cédula, nombre del cliente y método de pago son obligatorios", tipo: false });
      return;
    }
    if (!/^\d{10}$/.test(form.cliente.cedula)) {
      setMensaje({ respuesta: "La cédula debe tener exactamente 10 dígitos numéricos", tipo: false });
      return;
    }
    if (form.cliente.nombre.trim().length < 3) {
      setMensaje({ respuesta: "El nombre del cliente debe tener al menos 3 caracteres", tipo: false });
      return;
    }
    if (form.productos.length === 0 && form.accesorios.length === 0) {
      setMensaje({ respuesta: "Debe agregar al menos un dispositivo o accesorio a la venta", tipo: false });
      return;
    }
    if (form.metodoPago === "Transferencia" || form.metodoPago === "Tarjeta") {
      if (!form.numeroDocumento || !form.descripcionDocumento) {
        setMensaje({ respuesta: "Debe ingresar número y descripción de documento para el método seleccionado", tipo: false });
        return;
      }
    }
    if (form.descuento < 0) {
      setMensaje({ respuesta: "El descuento no puede ser negativo", tipo: false });
      return;
    }
    const confirmacion = window.confirm("¿Estás seguro de que deseas registrar esta venta?");
    if (!confirmacion) {
      setForm({
        cliente: { cedula: "", nombre: "" },
        metodoPago: "",
        observacion: "",
        productos: [],
        accesorios: [],
        descuento: 0,
        numeroDocumento: "",
        descripcionDocumento: "",
      });
      return;
    }
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
      setTimeout(() => setMensaje({}), 3000);
      setForm({
        cliente: { cedula: "", nombre: "" },
        metodoPago: "",
        observacion: "",
        productos: [],
        accesorios: [],
        descuento: 0,
        numeroDocumento: "",
        descripcionDocumento: "",
      });
      setProductoInput("");
      setAccesorioInput("");
      setTotal(0);
    } catch (error) {
      setMensaje({ respuesta: error.response?.data?.msg || "Error al registrar la venta", tipo: false });
      alert("Error al registrar la venta");
    }
  };


  const actualizarTotal = (productos, accesorios, descuento = 0) => {
    const totalProductos = productos.reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
    const totalAccesorios = accesorios.reduce((sum, a) => sum + parseFloat(a.precioAccs || 0), 0);
    const subtotal = totalProductos + totalAccesorios;
    const totalConDescuento = subtotal - descuento;
    const totalFinal = totalConDescuento >= 0 ? totalConDescuento : 0;

    setTotal(totalFinal);
    return totalFinal;
  };

  const handleDescuentoChange = (e) => {
  const nuevoDescuento = parseFloat(e.target.value) || 0;
  setForm((prev) => {
    const nuevoTotal = actualizarTotal(prev.productos, prev.accesorios, nuevoDescuento);
    return {
      ...prev,
      descuento: nuevoDescuento,
      total: nuevoTotal,
    };
  });
};



  return (

  <div className="p-8 bg-white min-h-screen">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-black">Registrar Venta</h1>
    </div>

    {Object.keys(mensaje).length > 0 && (
      <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
    )}

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-bold text-black">Cédula del Cliente</label>
        <input
          type="text"
          value={form.cliente.cedula}
          onChange={handleChange}
          name="cliente.cedula"
          className="w-full p-2 rounded border text-lefth"
          placeholder="Ingrese la cédula del cliente"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-black">Nombre del Cliente</label>
        <input
          type="text"
          value={form.cliente.nombre}
          onChange={handleChange}
          name="cliente.nombre"
          className="w-full p-2 rounded border text-lefth"
          placeholder="Ingrese el nombre del cliente"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-black">Método de Pago</label>
        <select
          value={form.metodoPago}
          onChange={handleChange}
          name="metodoPago"
          className="w-full p-2 rounded border text-lefth"
        >
          <option value="">Seleccione</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
        </select>
      </div>

      {(form.metodoPago === "Transferencia" || form.metodoPago === "Tarjeta") && (
        <>
          <div>
            <label className="text-sm font-bold text-black">Número de Documento</label>
            <input
              type="text"
              value={form.numeroDocumento}
              onChange={handleChange}
              name="numeroDocumento"
              className="w-full p-2 rounded border text-lefth"
              placeholder="Ingrese número de documento"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-black">Descripción del Documento</label>
            <input
              type="text"
              value={form.descripcionDocumento}
              onChange={handleChange}
              name="descripcionDocumento"
              className="w-full p-2 rounded border text-lefth"
              placeholder="Ingrese descripción"
            />
          </div>
        </>
      )}

      <div className="md:col-span-2">
        <label className="text-sm font-bold text-black">Observación</label>
        <textarea
          value={form.observacion}
          onChange={handleChange}
          name="observacion"
          className="w-full p-2 rounded border h-24 text-lefth"
          placeholder="Ingrese la observación"
        />
      </div>

      {/* Dispositivos */}
      <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-4">
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
          className="bg-black hover:bg-gray-700 text-white p-2 rounded mt-6 md:mt-0"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Tabla de Dispositivos */}
      {form.productos.length > 0 && (
        <div className="mt-6 md:col-span-2">
          <h2 className="text-lg font-bold mb-2">Dispositivos Agregados</h2>
          <table className="w-full table-auto border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Código de Barras</th>
                <th className="border px-2 py-1">Código Serial</th>
                <th className="border px-2 py-1">Nombre</th>
                <th className="border px-2 py-1">Color</th>
                <th className="border px-2 py-1">Capacidad</th>
                <th className="border px-2 py-1">Precio</th>
                <th className="border px-2 py-1">Acción</th>
              </tr>
            </thead>
            <tbody>
              {form.productos.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.codigoBarras}</td>
                  <td className="border px-2 py-1">{item.codigoSerial}</td>
                  <td className="border px-2 py-1">{item.nombreEquipo}</td>
                  <td className="border px-2 py-1">{item.color}</td>
                  <td className="border px-2 py-1">{item.capacidad}</td>
                  <td className="border px-2 py-1">${item.precio}</td>
                  <td className="border px-2 py-1">
                    <button
                      type="button"
                      onClick={() => deleteProducto(item.codigoBarras)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accesorios */}
      <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-4">
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
          className="bg-black hover:bg-gray-700 text-white p-2 rounded mt-6 md:mt-0"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Tabla de Accesorios */}
      {form.accesorios.length > 0 && (
        <div className="mt-6 md:col-span-2">
          <h2 className="text-lg font-bold mb-2">Accesorios Agregados</h2>
          <table className="w-full table-auto border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Código de Barras</th>
                <th className="border px-2 py-1">Nombre</th>
                <th className="border px-2 py-1">Precio</th>
                <th className="border px-2 py-1">Acción</th>
              </tr>
            </thead>
            <tbody>
              {form.accesorios.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.codigoBarrasAccs}</td>
                  <td className="border px-2 py-1">{item.nombreAccs}</td>
                  <td className="border px-2 py-1">${item.precioAccs}</td>
                  <td className="border px-2 py-1">
                    <button
                      type="button"
                      onClick={() => deleteAccesorio(item.codigoBarrasAccs)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-end mt-4 gap-4">
        {/* Descuento */}
          <div className="w-1/2 text-lefth">
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

          {/* Total */}
          <div className="w-1/2 text-right">
            <h3 className="text-lg font-semibold">
              Total a pagar: <span className="text-black">${total.toFixed(2)}</span>
            </h3>
          </div>
      </div>

      {/* Botón submit */}
      <div className="md:col-span-2 flex justify-center mt-6">
        <button
          type="submit"
          className="bg-black hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold"
        >
          REGISTRAR VENTA
        </button>
      </div>
    </form>
  </div>
);

};

export default RegistrarVentas;
