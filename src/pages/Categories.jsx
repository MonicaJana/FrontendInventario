import { useState, useEffect } from "react";
import ModalCategory from "../components/Modals/ModalCategory";
import TableCategories from "../components/TableCategories";
import axios from "axios";

const Categories = () => {
  
  const [categories, setCategories] = useState([])
  const [modalOpen, setModalOpen] = useState(false);


  const listCategories = async () => {
    try {
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_BACKEND_URL}/listarCategorias`;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
        const response = await axios.get(url, options);
        setCategories(response.data);
    } catch (error) {
        console.log(error);
    }
  };

    useEffect(() => {
        listCategories();
    }, []);

    const handleAddCategory = (newCategory) => {
      setModalOpen(false);
      listCategories();
    }

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Categorias Registradas</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          onClick={() => setModalOpen(true)}
        >
          + Registrar Categoria
        </button>
      </div>
      <TableCategories categories={categories} listCategories={listCategories}/>
        {modalOpen && (
        <ModalCategory
          onClose={() => setModalOpen(false)}
          listCategories={listCategories}
          onGuardar={handleAddCategory}
        />
      )}
    </div>
  );
};

export default Categories;
