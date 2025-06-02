import axios from 'axios';
import React, { useState, useContext} from 'react';
import { useNavigate} from 'react-router-dom';
import logo from '../assets/logo.jpg';
import Message from '../components/Alerts/Message';
import AuthContext from  '../context/AuthProvider'

export const Login = () => {
  const {auth} = useContext(AuthContext)
  const navigate = useNavigate()
  const {setAuth, perfil} = useContext(AuthContext)
  const [mensaje, setMensaje] = useState({})
  const [errors] = useState({})

  const [form, setform] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setform({
        ...form,
        [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/login`
        const respuesta = await axios.post(url, form)
        localStorage.setItem('token', respuesta.data.token)
        setAuth(respuesta.data)
        await perfil(respuesta.data.token)
        navigate('/dashboard/stock');
    } catch (error) {
        console.log(error.response.data)
        setMensaje({ respuesta: error.response.data.msg, tipo: false });
        setform({})
        setTimeout(() => {
            setMensaje({})
        }, 3000);
    }
  };


  return (
    <div className="flex min-h-screen">
      {/* Columna izquierda: Imagen del logo con fondo negro */}
      <div className="w-1/2 flex items-center justify-center bg-black">
        <img 
          src={logo} 
          alt="Logo" 
          className="max-w-full h-auto"
        />
      </div>

      {/* Columna derecha: Formulario */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-center text-black">SISTEMA DE INVENTARIO</h1>
          <p className="text-center mb-8 text-black">Ingresa tus datos para iniciar sesión</p>

          {Object.keys(mensaje).length > 0 && 
           (<Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
           )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor='nickname'
                className="block text-sm font-semibold mb-2 text-black"
              >
                Ingresa tu correo electrónico:
              </label>
              <input
                type="email"
                name="email"
                placeholder="ingresa tu nombre de usuario"
                className="block w-full p-2 rounded-md border border-gray-300 focus:border-black focus:ring-black focus:ring-1"
                value={form.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-black">Contraseña:</label>
              <input
                type="password"
                name="password"
                placeholder="********************"
                className="block w-full p-2 rounded-md border border-gray-300 focus:border-black focus:ring-black focus:ring-1"
                value={form.password || ""} 
                onChange={handleChange}
              />
            </div>
            <button
              type="submit" 
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
