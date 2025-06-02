import { useEffect, useState, useContext } from "react";
import axios from 'axios';
import Message from "../Alerts/Message";
import AuthContext from "../../context/AuthProvider";

const ModalDispositivos = ({ onClose, dispositive, listDispositives }) => {
  const isEditing = Boolean(dispositive);
  const [mensaje, setMensaje] = useState({});
  const { auth } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [capacidadesDisponibles, setCapacidadesDisponibles] = useState([]);

  const [form, setForm] = useState({
    codigoModelo: dispositive?.codigoModelo ?? "",
    codigoSerial: dispositive?.codigoSerial ?? "",
    nombreEquipo: dispositive?.nombreEquipo ?? "",
    color: dispositive?.color ?? "",
    capacidad: dispositive?.capacidad ?? "",
    precio: dispositive?.precio ?? "",
    responsable: [
      {
        id: auth?._id ?? "",
        nombre: auth?.nombre ?? ""
      }
    ],
    tipo: dispositive?.tipo ?? "",
    estado: "Disponible",
    categoriaNombre: dispositive?.categoriaNombre ?? "",
    locacion: auth?.area ?? ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const listCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_BACKEND_URL}/listarCategorias`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(url, options);
      setCategorias(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listCategories();
    
  if (form.categoriaNombre && typeof form.categoriaNombre === 'string') {
    const categoria = form.categoriaNombre.toLowerCase();
 
    if (categoria.includes("iphone") || categoria.includes("ipad")) {
      setCapacidadesDisponibles([
        "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"
      ]);
    } else if (
      categoria.includes("macbook") ||
      categoria.includes("mac mini") ||
      categoria.includes("imac")
    ) {
      setCapacidadesDisponibles([
        "256 GB / 8 GB RAM",
        "256 GB / 16 GB RAM",
        "512 GB / 16 GB RAM",
        "512 GB / 18 GB RAM"
      ]);
    } else if (categoria === "") {
      setCapacidadesDisponibles([]);
    } else {
      setCapacidadesDisponibles(["No aplica"]);
    }

    // Si la capacidad actual ya no está en las opciones válidas, la reseteamos
    if (!capacidadesDisponibles.includes(form.capacidad)) {
      setForm((prevForm) => ({ ...prevForm, capacidad: "" }));
  }}
}, [form.categoriaNombre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones de campos obligatorios
    if (!form.codigoModelo || !form.codigoSerial || !form.nombreEquipo || !form.color || !form.categoriaNombre || !form.capacidad || !form.precio || !form.tipo) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return;
    }
    if (isNaN(Number(form.precio)) || Number(form.precio) <= 0) {
      setMensaje({ respuesta: "El precio debe ser un número mayor a 0", tipo: false });
      return;
    }
    if (!categorias.some(cat => cat.nombreCategoria === form.categoriaNombre)) {
      setMensaje({ respuesta: "Seleccione una categoría válida", tipo: false });
      return;
    }
    if (capacidadesDisponibles.length > 0 && !capacidadesDisponibles.includes(form.capacidad)) {
      setMensaje({ respuesta: "Seleccione una capacidad válida", tipo: false });
      return;
    }
    if (!['Openbox', 'Nuevo', 'Semi-nuevo'].includes(form.tipo)) {
      setMensaje({ respuesta: "Seleccione un tipo válido", tipo: false });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const url = isEditing
        ? `${import.meta.env.VITE_BACKEND_URL}/actualizarProducto/${dispositive.codigoBarras}`
        : `${import.meta.env.VITE_BACKEND_URL}/agregarProducto`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

    console.log (form)
      const respuesta = isEditing
        ? await axios.put(url, form, options)
        : await axios.post(url, form, options);
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
      setTimeout(() => {
        setForm({
          codigoModelo: "",
          codigoSerial: "",
          nombreEquipo: "",
          color: "",
          capacidad: "",
          precio: "",
          tipo: "",
          estado: "Disponible",
          responsable: "",
          categoriaNombre: "",
          locacion: ""
        });
        onClose();
        setMensaje({});
        listDispositives();
      }, 2000);
    } catch (error) {
      setMensaje({ respuesta: error.response?.data?.msg || "Error", tipo: false });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-black mb-4">
          {isEditing ? 'Editar Dispositivo' : 'Registrar Dispositivo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-black text-sm font-semibold">Código Modelo:</label>
              <input
                name="codigoModelo"
                value={form.codigoModelo}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                type="text"
                placeholder="Código modelo"
              />
            </div>

            <div>
              <label className="text-black text-sm font-semibold">Código Serial:</label>
              <input
                name="codigoSerial"
                value={form.codigoSerial}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                type="text"
                placeholder="Código Serial"
              />
            </div>

            <div>
              <label className="text-black text-sm font-semibold">Nombre:</label>
              <input
                name="nombreEquipo"
                value={form.nombreEquipo}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                type="text"
                placeholder="Nombre del equipo"
              />
            </div>

            <div>
              <label className="text-black text-sm font-semibold">Color:</label>
              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                type="text"
                placeholder="Color del equipo"
              />
            </div>

            <div>
              <label className="text-black text-sm font-semibold">Categoría:</label>
              <select
                name="categoriaNombre"
                value={form.categoriaNombre}
                onChange={handleChange}
                className="border w-full p-2 rounded"
              >
                <option value="">Selecciona la categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria._id} value={categoria.nombreCategoria}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>

           <div>
            <label className="text-black text-sm font-semibold">Capacidad:</label>
            <select
              name="capacidad"
              value={form.capacidad}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            >
              <option value="">Selecciona la capacidad</option>
              {capacidadesDisponibles.map((capacidad, idx) => (
                <option key={idx} value={capacidad}>
                  {capacidad}
                </option>
              ))}
            </select>
          </div>

            <div>
              <label className="text-black text-sm font-semibold">Precio:</label>
              <input
                name="precio"
                value={form.precio}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                type="number"
                placeholder="Precio"
              />
            </div>

            <div>
              <label className="text-black text-sm font-semibold">Tipo:</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="border w-full p-2 rounded"
              >
                <option value="">Selecciona el tipo</option>
                <option value="Openbox">Openbox</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Semi-nuevo">Semi-nuevo</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="mt-4 bg-black text-white w-full p-3 rounded font-bold hover:bg-gray-800 transition"
          >
            {isEditing ? ' ACTUALIZAR' : ' REGISTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalDispositivos;
