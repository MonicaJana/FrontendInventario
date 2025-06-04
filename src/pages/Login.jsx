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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Columna izquierda: Imagen del logo con fondo negro */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-black py-8 md:py-0">
        <img 
          src={logo} 
          alt="Logo" 
          className="max-w-[200px] md:max-w-[300px] lg:max-w-[400px] h-auto"
        />
      </div>

      {/* Columna derecha: Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-0">
        <div className="p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center text-black">SISTEMA DE INVENTARIO</h1>
          <p className="text-center text-sm md:text-base mb-4 md:mb-8 text-black">Ingresa tus datos para iniciar sesión</p>

          {Object.keys(mensaje).length > 0 && 
           (<Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
           )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor='email'
                className="block text-xs font-semibold mb-2 text-black"
              >
                Ingresa tu correo electrónico:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                className="block w-full p-2 md:p-3 rounded-md border border-gray-300 focus:border-black focus:ring-black focus:ring-1 text-sm md:text-base"
                value={form.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label 
                htmlFor="password"
                className="block text-xs font-semibold mb-2 text-black"
              >
                Contraseña:
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="********************"
                className="block w-full p-2 md:p-3 rounded-md border border-gray-300 focus:border-black focus:ring-black focus:ring-1 text-sm md:text-base"
                value={form.password || ""} 
                onChange={handleChange}
              />
            </div>
            <button
              type="submit" 
              className="w-full bg-black text-white p-2 md:p-3 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm md:text-base font-medium"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
