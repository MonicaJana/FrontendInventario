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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-black mb-4">
          {isEditing ? 'Editar Accesorio' : 'Registrar Accesorio'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
          )}
          <div className="flex flex-wrap -mx-2">
            <div className="w-full px-2">
              <label className="text-black text-xs font-bold">Código Modelo:</label>
              <input
                id="codigoModeloAccs"
                name="codigoModeloAccs"
                value={form.codigoModeloAccs}
                onChange={handleChange}
                className="border-2 w-full p-1 mt-1 rounded-md mb-3"
                type="text"
                placeholder="Código modelo"
              />
            </div>

            <div className="w-full px-2">
              <label className="text-black text-xs font-bold">Nombre:</label>
              <input
                id="nombreAccs"
                name="nombreAccs"
                value={form.nombreAccs}
                onChange={handleChange}
                className="border-2 w-full p-1 mt-1 rounded-md mb-3"
                type="text"
                placeholder="Nombre accesorio"
              />
            </div>

            <div className="w-full px-2">
              <label className="text-black text-xs font-bold">Precio:</label>
              <input
                id="precioAccs"
                name="precioAccs"
                value={form.precioAccs}
                onChange={handleChange}
                className="border-2 w-full p-1 mt-1 rounded-md mb-3"
                type="text"
                placeholder="Precio accesorio"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-black w-full p-2 text-white uppercase font-bold rounded-lg hover:bg-gray-700 transition-all"
          >
            {isEditing ? 'ACTUALIZAR' : 'REGISTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalAccesory;
