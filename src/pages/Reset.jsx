import logo from '../assets/logo.jpg';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import Message from "../components/Alerts/Message";
import axios from 'axios';

const Reset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (datos) => {
    if (datos.password !== datos.confirmpassword) {
      setMensaje({ respuesta: 'Las contraseñas no coinciden', tipo: false });
      return;
    }
  
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/cambiar-contrasena/${token}`, {
        token: token,
        passwordnuevo: datos.password,
      });
  
      setMensaje({ respuesta: response.data.msg, tipo: true });
      setTimeout(() => navigate('/'), 2000);
  
    } catch (error) {
      console.log(error);
      const mensajeError = error.response?.data?.msg || 'Error al cambiar la contraseña';
      setMensaje({ respuesta: mensajeError, tipo: false });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-black">Cambiar contraseña</h1>
          <p className="text-sm text-gray-600">Ingresa y confirma tu nueva contraseña</p>
        </div>

        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="object-cover h-28 w-28 rounded-full border-2 border-gray-700"
          />
        </div>

        {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
          )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="mt-1 w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-1 focus:ring-gray-700"
              {...register("password", { required: "La contraseña es obligatoria" })}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="mt-1 w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-1 focus:ring-gray-700"
              {...register("confirmpassword", { required: "La confirmación es obligatoria" })}
            />
            {errors.confirmpassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmpassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
