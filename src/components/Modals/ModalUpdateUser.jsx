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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => setShowModal(false)}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-black mb-4">Editar Usuario: {user.nombre} {user.apellido}</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
          )}

          <div className="flex flex-wrap -mx-2">
            {/* Teléfono */}
            <div className="w-1/2 px-2">
              <label className="text-black text-xs font-bold">Teléfono:</label>
              <input
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="border-2 w-full p-1 mt-1 rounded-md mb-3"
                type="text"
                placeholder="Teléfono"
              />
            </div>

            {/* Área */}
            <div className="w-1/2 px-2">
              <label className="text-black text-xs font-bold">Área:</label>
              <select
                id="area"
                name="area"
                value={form.area}
                onChange={handleChange}
                className="border-2 w-full p-1 mt-1 rounded-md mb-3"
              >
                <option value="">Selecciona un área</option>
                <option value="Unicornio">Unicornio</option>
                <option value="Bodega Principal">Bodega Principal</option>
                <option value="Bodega Plaza">Bodega Plaza</option>
              </select>
            </div>

            {/* Rol */}
            <div className="w-1/2 px-2">
              <label className="text-black text-xs font-bold">Rol:</label>
              <select
                id="rol"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="border-2 w-full p-1 mt-1 rounded-md mb-3"
              >
                <option value="">Selecciona un rol</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Bodeguero">Bodeguero</option>
              </select>
            </div>

            {/* Estado */}
            <div className="w-1/2 px-2">
              <label className="text-black text-xs font-bold">Estado:</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border-2 w-full p-1 mt-1 rounded-md mb-3"
              >
                <option value="">Selecciona estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

             {/* Checkbox para cambiar contraseña */}
            <div className="w-full px-2">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={() => setChangePassword(!changePassword)}
                  className="form-checkbox"
                />
                <span className="text-black text-sm">¿Desea cambiar la contraseña?</span>
              </label>
            </div>
            {/* Campos de contraseña actual y nueva si se activa el cambio */}
            {changePassword && (
              <>
                <div className="flex items-end gap-4 mb-4">
                  {/* Contraseña Actual */}
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Contraseña Nueva
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingrese la contraseña nueva"
                      value={passwordNuevo}
                      onChange={(e) => setPasswordNuevo(e.target.value)}
                    />
                  </div>

                  {/* Nueva Contraseña */}
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Repetir Contraseña
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Repita contraseña"
                      value={repetirPassword}
                      onChange={(e) => setRepetirPassword(e.target.value)}
                    />
                  </div>

                  {/* Botón */}
                  <div className="w-1/3">
                    <button
                      type="button"
                      className="w-full bg-black text-white py-2 mt-6 rounded-md hover:bg-gray-700 transition"
                      onClick={handleUpdatePassword}
                    >
                      ACTUALIZAR
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {!changePassword && (
            <button
              type="submit"
              className="bg-black w-full p-2 text-white uppercase font-bold rounded-lg hover:bg-gray-700 transition-all"
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
