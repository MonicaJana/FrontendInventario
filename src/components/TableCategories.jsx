import { useState } from "react";
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalUpdateCategory from "./Modals/ModalUpdateCategory";

const TableCategories =({categories, listCategories}) =>{
    
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState({})

    const handleDelete = async (id) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar la categoria?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarCategoria/${id}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url,options);

            listCategories();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (category) => {
       setSelectedCategory(category);
        setShowModal(true);
    }

   

        return (
            <>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <th className="border px-4 py-2">Categoría</th>
                            <th className="border px-4 py-2">Descripción</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} className="text-center">
                                <td className="border px-4 py-2">{category.nombreCategoria}</td>
                                <td className="border px-4 py-2">{category.descripcionCategoria}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Editar"
                                    >
                                        <PencilSquareIcon className="w-5 h-5 inline" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Eliminar"
                                    >
                                        <TrashIcon className="w-5 h-5 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
    
                {showModal && selectedCategory && (
                    <ModalUpdateCategory
                    category={selectedCategory}
                    setShowModal={setShowModal}
                    listCategories={listCategories}
                    setMensaje={setMensaje}/>
                )}
            </>
        );

}

export default TableCategories;