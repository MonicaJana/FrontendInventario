import { useState } from "react";
import Message from "../Alerts/Message";
import axios from 'axios';

const ModalUpdateUser = ({ user, setShowModal, listUsers}) => {
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    telefono: user?.telefono ?? "",
    area: user?.area ?? "",
    rol: user?.rol ?? "",
    status: user?.status ?? "activo"
  });
  const [changePassword, setChangePassword] = useState(false);
  const [repetirPassword, setRepetirPassword] = useState("");
  const [passwordNuevo, setPasswordNuevo] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validaciones de campos
    if (!form.telefono || !form.area || !form.rol || !form.status) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return;
    }
    if (!/^\d{10}$/.test(form.telefono)) {
      setMensaje({ respuesta: "El teléfono debe tener exactamente 10 dígitos numéricos", tipo: false });
      return;
    }
    if (!['Unicornio', 'Bodega Principal', 'Bodega Plaza'].includes(form.area)) {
      setMensaje({ respuesta: "Seleccione un área válida", tipo: false });
      return;
    }
    if (!['Vendedor', 'Bodeguero'].includes(form.rol)) {
      setMensaje({ respuesta: "Seleccione un rol válido", tipo: false });
      return;
    }
    if (!['activo', 'inactivo', 'Activo', 'Inactivo'].includes(form.status)) {
      setMensaje({ respuesta: "Seleccione un estado válido", tipo: false });
      return;
    }

    try {
        const token = localStorage.getItem('token')
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${user.cedula}`
        const options = {
            headers: {
                method: 'PUT',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        const respuesta = await axios.put(url, form, options)
        setMensaje({respuesta:respuesta.data.msg,tipo:true})
         // Si se quiere cambiar contraseña, llamamos al otro handler
        if (changePassword) {
          await handleUpdatePassword();
        }
        setTimeout(() => {
            setShowModal(false);
            listUsers();
            setMensaje({});
          }, 1000);
    } catch (error) {
        setMensaje({respuesta:error.response?.data?.msg || "Error al actualizar usuario",tipo:false})
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async () => {
    if (!repetirPassword || !passwordNuevo) {
      setMensaje({ respuesta: "Debe completar ambos campos de contraseña", tipo: false });
      return;
    }
    if (passwordNuevo.length < 6) {
      setMensaje({ respuesta: "La nueva contraseña debe tener al menos 6 caracteres", tipo: false });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/nuevapassword/${user.cedula}`;
      const respuesta = await axios.put(
        url,
        {
          passwordnuevo: passwordNuevo,
          repetirpassword: repetirPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
      setRepetirPassword("");
      setPasswordNuevo("");
      setChangePassword(false);
    } catch (error) {
      setMensaje({
        respuesta: error.response?.data?.msg || "Error al actualizar la contraseña",
        tipo: false,
      });
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 md:p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={() => setShowModal(false)}
        >
          ✖
        </button>

        <h2 className="text-lg md:text-xl font-bold text-black mb-4">
          Editar Usuario: {user.nombre} {user.apellido}
        </h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Área */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Área:</label>
              <select
                id="area"
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
              >
                <option value="">Selecciona un área</option>
                <option value="Unicornio">Unicornio</option>
                <option value="Bodega Principal">Bodega Principal</option>
                <option value="Bodega Plaza">Bodega Plaza</option>
              </select>
            </div>

            {/* Rol */}
            <div>
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

            {/* Estado */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">Estado:</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 text-sm border-2 rounded-md"
              >
                <option value="">Selecciona estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Checkbox para cambiar contraseña */}
          <div className="w-full mt-4">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={() => setChangePassword(!changePassword)}
                className="form-checkbox"
              />
              <span className="text-sm text-black">¿Desea cambiar la contraseña?</span>
            </label>
          </div>

          {/* Campos de contraseña */}
          {changePassword && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Contraseña Nueva
                </label>
                <input
                  type="password"
                  className="w-full p-2 text-sm border rounded-md"
                  placeholder="Ingrese la contraseña nueva"
                  value={passwordNuevo}
                  onChange={(e) => setPasswordNuevo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Repetir Contraseña
                </label>
                <input
                  type="password"
                  className="w-full p-2 text-sm border rounded-md"
                  placeholder="Repita contraseña"
                  value={repetirPassword}
                  onChange={(e) => setRepetirPassword(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full bg-black text-white p-2 text-sm rounded-md hover:bg-gray-700 transition"
                  onClick={handleUpdatePassword}
                >
                  ACTUALIZAR CONTRASEÑA
                </button>
              </div>
            </div>
          )}

          {!changePassword && (
            <button
              type="submit"
              className="w-full p-2 mt-4 bg-black text-white text-sm uppercase font-bold rounded-lg hover:bg-gray-700 transition-all"
            >
              ACTUALIZAR
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ModalUpdateUser;
