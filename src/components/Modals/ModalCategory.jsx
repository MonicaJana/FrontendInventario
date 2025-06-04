import { useState } from "react";
import axios from 'axios';
import Message from "../Alerts/Message"

const ModalCategory = ({ onClose, category, listCategories}) =>{
    const [form, setForm]   = useState ({
        nombreCategoria: category?.nombreCategoria ??"",
        descripcionCategoria: category?.descripcionCategoria ??""
    });

    const [mensaje, setMensaje] = useState({})

    const handleChange = (e) => {
     setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e) => {
        e.preventDefault();
        // Validaciones
        if (!form.nombreCategoria || !form.descripcionCategoria) {
          setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
          return;
        }
        if (form.nombreCategoria.trim().length < 3) {
          setMensaje({ respuesta: "El nombre debe tener al menos 3 caracteres", tipo: false });
          return;
        }
        if (form.descripcionCategoria.trim().length < 5) {
          setMensaje({ respuesta: "La descripción debe tener al menos 5 caracteres", tipo: false });
          return;
        }
        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_BACKEND_URL}/crearCategoria`
            const options={
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
        
        const respuesta = await axios.post(url,form,options)
        setMensaje({respuesta:respuesta.data.msg,tipo:true})
        setTimeout(() => {
          setForm({
            nombreCategoria: "",
            descripcionCategoria: ""
          })
            onClose();
            setMensaje({});
            listCategories();
          }, 2000);
        } catch (error) {
            setMensaje({respuesta:error.response.data.msg,tipo:false})      
        }
     }

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
     
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Registrar Categoria</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.keys(mensaje).length > 0 && (
                        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
                    )}
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700">
                                Nombre:
                            </label>
                            <input
                                id="nombreCategoria"
                                name="nombreCategoria"
                                value={form.nombreCategoria}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-transparent"
                                type="text"
                                placeholder="Nombre de la categoría"
                            />
                        </div>
     
                        <div className="space-y-1">
                            <label htmlFor="descripcionCategoria" className="block text-sm font-medium text-gray-700">
                                Descripción:
                            </label>
                            <textarea
                                id="descripcionCategoria"
                                name="descripcionCategoria"
                                value={form.descripcionCategoria}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-transparent min-h-[100px]"
                                placeholder="Descripción de la categoría"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                    >
                        REGISTRAR
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ModalCategory;