import { useState } from "react";
import axios from 'axios';
import Message from "../Alerts/Message"

const ModalUser = ({ onClose,listUsers, usuario}) => {

  const [form, setForm] = useState({
    nombre: usuario?.nombre ??"",
    apellido: usuario?.apellido ??"",
    cedula: usuario?.cedula ??"",
    telefono: usuario?.telefono ??"",
    email: usuario?.email ??"",
    area: usuario?.area ??"",
    rol: usuario?.rol ?? "",
    status: "Activo"
  });

  const [mensaje, setMensaje] = useState({})
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación de campos vacíos
  if (!form.nombre || !form.apellido || !form.cedula || !form.telefono || !form.email || !form.area || !form.rol) {
    setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
    return;
  }
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMensaje({ respuesta: "El correo electrónico no es válido", tipo: false });
      return;
    }

    // Validar cédula
    if (!/^\d{10}$/.test(form.cedula)) {
      setMensaje({ respuesta: "La cédula debe tener exactamente 10 dígitos numéricos", tipo: false });
      return;
    }

    // Validar teléfono
    if (!/^\d{10}$/.test(form.telefono)) {
      setMensaje({ respuesta: "El teléfono debe tener exactamente 10 dígitos numéricos", tipo: false });
      return;
    }

    try {
        const token = localStorage.getItem('token')
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        const options={
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          }
      }
        const respuesta = await axios.post(url,form,options)
        console.log(respuesta);
        setMensaje({respuesta:respuesta.data.msg,tipo:true})
        setTimeout(() => {
          setForm({
            nombre: "",
            apellido: "",
            cedula: "",
            telefono: "",
            email: "",
            password: "",
            area: "",
            rol: "",
            status: "Activo"
          });
          onClose();
          setMensaje({});
          listUsers();
        }, 2000);

    } catch (error) {
      console.log(error);
      setMensaje({respuesta:error.response.data.msg,tipo:false})
    }
}
  
 
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 md:p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-lg md:text-xl font-bold text-black mb-4">Registrar Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Nombre:</label>
              <input
                id='nombre'
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Nombre"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Apellido:</label>
              <input
                id="apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Apellido"
              />
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Cédula:</label>
              <input
                id="cedula"
                name="cedula"
                value={form.cedula}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Cédula"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Teléfono:</label>
              <input
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Teléfono"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Email:</label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="email"
                placeholder="Correo Electrónico"
              />
            </div>

            {/* Área */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Área:</label>
              <input
                id="area"
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="area"
                placeholder="Área"
              />
            </div>

            {/* Rol */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-bold text-black mb-1">Rol:</label>
              <select
                id="rol"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
              >
                <option value="">Selecciona un rol</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Bodeguero">Bodeguero</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 mt-4 bg-black text-white text-sm uppercase font-bold rounded-lg hover:bg-gray-700 transition-all"
          >
            REGISTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalUser;
