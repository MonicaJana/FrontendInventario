import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import Message from '../components/Alerts/Message';
import AuthContext from '../context/AuthProvider';

export const Login = () => {
  const navigate = useNavigate();
  const { setAuth, perfil } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  // Limpiar mensaje después de 3 segundos
  useEffect(() => {
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [mensaje]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const validarForm = () => {
    if (!form.email || !form.password) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMensaje({ respuesta: "Ingrese un correo electrónico válido", tipo: false });
      return false;
    }

    if (form.password.length < 6) {
      setMensaje({ respuesta: "La contraseña debe tener al menos 6 caracteres", tipo: false });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarForm()) return;

    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/login`;
      const respuesta = await axios.post(url, form);
      
      localStorage.setItem('token', respuesta.data.token);
      setAuth(respuesta.data);
      await perfil(respuesta.data.token);
      
      navigate('/dashboard/stock');
    } catch (error) {
      console.error('Error de login:', error);
      setMensaje({ 
        respuesta: error.response?.data?.msg || "Error al iniciar sesión", 
        tipo: false 
      });
      setForm({ email: form.email, password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-black py-8 md:py-0">
        <img 
          src={logo} 
          alt="Logo" 
          className="max-w-[200px] md:max-w-[300px] lg:max-w-[400px] h-auto"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-0">
        <div className="p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center text-black">
            SISTEMA DE INVENTARIO
          </h1>
          <p className="text-center text-sm md:text-base mb-4 md:mb-8 text-black">
            Ingresa tus datos para iniciar sesión
          </p>

          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>
              {mensaje.respuesta}
            </Message>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="email"
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
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
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
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black text-white p-2 md:p-3 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm md:text-base font-medium flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
