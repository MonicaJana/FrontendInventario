import { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import Message from "../Alerts/Message";

const ModalUser = ({ onClose, listUsers, usuario }) => {
  const initialForm = {
    nombre: usuario?.nombre ?? "",
    apellido: usuario?.apellido ?? "",
    cedula: usuario?.cedula ?? "",
    telefono: usuario?.telefono ?? "",
    email: usuario?.email ?? "",
    area: usuario?.area ?? "",
    rol: usuario?.rol ?? "",
    status: "Activo"
  };

  const [form, setForm] = useState(initialForm);
  const [mensaje, setMensaje] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setForm(prev => ({ ...prev, [name]: value.trim() }));
  }, []);

  const validarForm = useCallback(() => {
    // Validación de campos vacíos
    if (!form.nombre || !form.apellido || !form.cedula || !form.telefono || 
        !form.email || !form.area || !form.rol) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMensaje({ respuesta: "El correo electrónico no es válido", tipo: false });
      return false;
    }

    // Validar cédula
    if (!/^\d{10}$/.test(form.cedula)) {
      setMensaje({ respuesta: "La cédula debe tener exactamente 10 dígitos numéricos", tipo: false });
      return false;
    }

    // Validar teléfono
    if (!/^\d{10}$/.test(form.telefono)) {
      setMensaje({ respuesta: "El teléfono debe tener exactamente 10 dígitos numéricos", tipo: false });
      return false;
    }

    return true;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_BACKEND_URL}/registro`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const respuesta = await axios.post(url, form, options);
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
      
      setTimeout(() => {
        setForm(initialForm);
        onClose();
        listUsers();
      }, 2000);

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMensaje({
        respuesta: error.response?.data?.msg || "Error al registrar usuario",
        tipo: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 md:p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ✖
        </button>

        <h2 className="text-lg md:text-xl font-bold text-black mb-4">Registrar Usuario</h2>
        
        {Object.keys(mensaje).length > 0 && (
          <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">Nombre:</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Nombre"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Apellido:</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Apellido"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Cédula:</label>
              <input
                name="cedula"
                value={form.cedula}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Cédula"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Teléfono:</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Teléfono"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Email:</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="email"
                placeholder="Correo Electrónico"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Área:</label>
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                type="text"
                placeholder="Área"
                disabled={isSubmitting}
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-bold text-black mb-1">Rol:</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
                disabled={isSubmitting}
              >
                <option value="">Selecciona un rol</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Bodeguero">Bodeguero</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 mt-4 bg-black text-white text-sm uppercase font-bold rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </>
            ) : (
              'REGISTRAR'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalUser;
