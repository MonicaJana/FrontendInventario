import axios from 'axios';
import { useState, useEffect } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

const Stock = () => {
  const [stock, setStock] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stockSeleccionado, setStockSeleccionado] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [codigosModal, setCodigosModal] = useState([]);
  // Filtros
  const [nombre, setNombre] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensajeError, setMensajeError] = useState("");

  const listStock = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (nombre) params.append('nombre', nombre);
      if (capacidad) params.append('capacidad', capacidad);
      if (categoria) params.append('categoria', categoria);

      const url = `${import.meta.env.VITE_BACKEND_URL}/stockDisponible?${params.toString()}`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(url, options);
      const data = response.data;
      console.log(data)
      const productos = (data.productos || []).map(item => ({
        tipo: item.tipo,
        codigoModelo: item.codigoModelo,
        nombre: item.nombreEquipo,
        color: item.color,
        capacidad: item.capacidad,
        cantidad: item.cantidad,
        codigos: item.codigoB || [], // Para productos, usa 'codigoB'
      }));

      const accesorios = (data.accesorios || []).map(item => ({
        tipo: "accesorio",
        codigoModelo: item.codigoModeloAccs,
        nombre: item.nombreAccs,
        color: '—',
        capacidad: '—',
        cantidad: item.cantidad,
        codigos: item.codigosBarras || [], // Para accesorios, usa 'codigosBarras'
      }));

      setStock([...productos, ...accesorios]);
    } catch (error) {
      console.error('Error al obtener el stock:', error);
      setStock([]);
    }
  };

  
    const handleFiltrar = () => {
        // Validaciones de filtros
        setMensajeError("");
        listStock();
    };

    const handleVerDetalle = (stock) => {
        setStockSeleccionado(stock);
        // Mostrar los códigos de barra según el campo 'codigos'
        if (stock.codigos && Array.isArray(stock.codigos)) {
            setCodigosModal(stock.codigos);
        } else {
            setCodigosModal([]);
        }
        setModalOpen(true);
    };

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
        console.log(response.data)
        setCategorias(response.data);
        } catch (error) {
        console.log(error);
        }
    };

      useEffect(() => {
        listStock();
        listCategories();
    }, []); // Se carga inicialmente


  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Stock Disponible</h1>
      </div>
    
        <label className="block text-sm font-medium text-gray-700">Puede aplicar filtros utilizando uno, varios o todos los campos disponibles</label>   
      {/* Filtros */}
      <div className="w-full flex justify-end mb-6">
        
        <div className="flex flex-wrap gap-4 mb-6">
            <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 rounded"
            />
            <input
            type="text"
            placeholder="Capacidad"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            className="border p-2 rounded"
            />
            <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border p-2 rounded bg-white"
                >
                <option value="">Categorías</option>
                {categorias.map((cat) => (
                    <option key={cat._id} value={cat.nombreCategoria}>
                    {cat.nombreCategoria}
                    </option>
                ))}
                </select>
            <button
            onClick={handleFiltrar}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
            >
            Filtrar
            </button>
        </div>
    </div>

      <div className="overflow-x-auto">
        {mensajeError && (
          <div className="mb-4 text-red-600 font-semibold text-center">{mensajeError}</div>
        )}
        <table className="w-full border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="border px-4 py-2">Tipo</th>
              <th className="border px-4 py-2">Código Modelo</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Color</th>
              <th className="border px-4 py-2">Capacidad</th>
              <th className="border px-4 py-2">Cantidad</th>
              <th className="border px-4 py-2">Códigos de Barra</th>
            </tr>
          </thead>
          <tbody>
                {stock.length === 0 ? (
                    <tr>
                    <td colSpan="7" className="text-center border px-4 py-2">
                        No se encontraron dispositivos ni accesorios con los filtros aplicados
                    </td>
                    </tr>
            ): (stock.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.tipo}</td>
                <td className="border px-4 py-2">{item.codigoModelo}</td>
                <td className="border px-4 py-2">{item.nombre}</td>
                <td className="border px-4 py-2">{item.color}</td>
                <td className="border px-4 py-2">{item.capacidad}</td>
                <td className="border px-4 py-2">{item.cantidad}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleVerDetalle(item)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Ver detalle"
                  >
                    <EyeIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))
        )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Códigos de Barras</h2>
            {codigosModal.length > 0 ? (
              <ul className="list-disc pl-6">
                {codigosModal.map((codigo, idx) => (
                  <li key={idx} className="text-black text-lg">{codigo}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No hay códigos de barra disponibles para este dispositivo.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
