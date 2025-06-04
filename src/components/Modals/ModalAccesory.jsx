import { useState, useContext } from "react";
import axios from 'axios';
import Message from "../Alerts/Message"
import AuthContext from "../../context/AuthProvider";

const ModalAccesory = ({ onClose, accesory, listAccesories }) => {
  const isEditing = Boolean(accesory);
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    codigoModeloAccs: accesory?.codigoModeloAccs ?? "",
    nombreAccs: accesory?.nombreAccs ?? "",
    precioAccs: accesory?.precioAccs ?? "",
    disponibilidadAccs: "Disponible",
    responsableAccs: [
      {
        id: auth?._id ?? "",
        nombre: auth?.nombre ?? ""
      }
    ],
    locacionAccs: auth?.area ?? "",
    categoriaNombre: "accesorio",
  });

  const [mensaje, setMensaje] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = isEditing
        ? `${import.meta.env.VITE_BACKEND_URL}/actualizarAccesorio/${accesory.codigoBarrasAccs}`
        : `${import.meta.env.VITE_BACKEND_URL}/agregarAccesorio`;

      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = isEditing
        ? await axios.put(url, form, options)
        : await axios.post(url, form, options);

      setMensaje({ respuesta: respuesta.data.msg, tipo: true });

      setTimeout(() => {
        setForm({
          codigoModeloAccs: "",
          nombreAccs: "",
          precioAccs: "",
          disponibilidadAccs: "Disponible",
          responsableAccs:"",
          locacionAccs:"",
          categoriaNombre:"accesorio"
        });
        onClose();
        setMensaje({});
        listAccesories();
      }, 2000);
    } catch (error) {
      console.log(error);
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-4 sm:p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
          {isEditing ? 'Editar Accesorio' : 'Registrar Accesorio'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="codigoModeloAccs" className="block text-sm font-medium text-gray-700">
                Código Modelo:
              </label>
              <input
                id="codigoModeloAccs"
                name="codigoModeloAccs"
                value={form.codigoModeloAccs}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-transparent"
                type="text"
                placeholder="Código modelo"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="nombreAccs" className="block text-sm font-medium text-gray-700">
                Nombre:
              </label>
              <input
                id="nombreAccs"
                name="nombreAccs"
                value={form.nombreAccs}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-transparent"
                type="text"
                placeholder="Nombre del accesorio"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="precioAccs" className="block text-sm font-medium text-gray-700">
                Precio:
              </label>
              <input
                id="precioAccs"
                name="precioAccs"
                value={form.precioAccs}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-transparent"
                type="number"
                min="0"
                step="0.01"
                placeholder="Precio del accesorio"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 mt-6"
          >
            {isEditing ? 'ACTUALIZAR' : 'REGISTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalAccesory;
