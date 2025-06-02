import { useState } from "react";
import axios from 'axios';
import Message from "../Alerts/Message"

const ModalUpdateCategory = ({ category, setShowModal, listCategories}) =>{
    
    const [form, setForm]   = useState ({
        nombreCategoria: category?.nombreCategoria ??"",
        descripcionCategoria: category?.descripcionCategoria ??""
    });

    const [mensaje, setMensaje] = useState({})

    const handleUpdate = async (e) => {
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
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarCategoria/${category._id}`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        const respuesta = await axios.put(url, form, options)
        setMensaje({respuesta:respuesta.data.msg,tipo:true})
        setTimeout(() => {
            setShowModal(false);
            listCategories();
            setMensaje({});
          }, 1000);
      } catch (error) {
        setMensaje({respuesta:error.response.data.msg,tipo:false})
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
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
     
             <h2 className="text-xl font-bold text-black mb-4">Editar Categoria </h2>
             <form onSubmit={handleUpdate} className="space-y-4">
               {Object.keys(mensaje).length > 0 && (
               <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
               )}
               <div className="flex flex-wrap -mx-2">
                 {/* Nombre */}
                 <div className="w-full px-2">
                   <label className="text-black text-xs font-bold">Nombre:</label>
                   <input
                     id='nombreCategoria'
                     name="nombreCategoria"
                     value={form.nombreCategoria}
                     onChange={handleChange}
                     className="border-2 w-full p-1 mt-1 rounded-md mb-3"
                     type="text"
                     placeholder="Nombre categoria "
                   />
                 </div>
     
                 {/* Descripción */}
                 <div className="w-full px-2">
                   <label className="text-black text-xs font-bold">Descripción:</label>
                   <textarea
                     id="descripcionCategoria"
                     name="descripcionCategoria"
                     value={form.descripcionCategoria}
                     onChange={handleChange}
                     className="border-2 w-full p-1 mt-1 rounded-md mb-3"
                     type="text"
                     placeholder="Descripción"
                   />
                </div>

                </div>
               <button
                 type="submit"
                 className="bg-black w-full p-2 text-white uppercase font-bold rounded-lg hover:bg-gray-700 transition-all"
               >
                 ACTUALIZAR
               </button>
             </form>
           </div>
         </div>
       );

}

export default ModalUpdateCategory;