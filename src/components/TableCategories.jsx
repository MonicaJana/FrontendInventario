import { useState } from "react";
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalUpdateCategory from "./Modals/ModalUpdateCategory";

const TableCategories = ({ categories, listCategories }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (id) => {
        const confirm = window.confirm("¿Estás seguro que deseas eliminar la categoria?");
        if (!confirm) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarCategoria/${id}`;
            await axios.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            await listCategories();
        } catch (error) {
            const errorMessage = error.response?.data?.msg || "Error al eliminar la categoría";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`bg-white divide-y divide-gray-200 ${isLoading ? 'opacity-50' : ''}`}>
                        {categories.map((category) => (
                            <tr key={category._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                    {category.nombreCategoria}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {category.descripcionCategoria}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                            title="Editar"
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedCategory && (
                <ModalUpdateCategory
                    category={selectedCategory}
                    setShowModal={setShowModal}
                    listCategories={listCategories}
                />
            )}
        </>
    );
}

export default TableCategories;