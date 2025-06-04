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
    <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Stock Disponible</h1>
      </div>
    
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Puede aplicar filtros utilizando uno, varios o todos los campos disponibles
        </p>   
        
        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Capacidad"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-black focus:border-transparent"
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
            className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filtrar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {mensajeError && (
          <div className="p-4 mb-4 text-red-600 font-semibold text-center bg-red-50 border-l-4 border-red-500">
            {mensajeError}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Tipo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Código Modelo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Nombre</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Color</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Capacidad</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Cantidad</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Códigos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stock.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-3 py-4 text-sm text-center text-gray-500">
                    No se encontraron dispositivos ni accesorios con los filtros aplicados
                  </td>
                </tr>
              ) : (
                stock.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{item.tipo}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{item.codigoModelo}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{item.nombre}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{item.color}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{item.capacidad}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.cantidad}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">
                      <button
                        onClick={() => handleVerDetalle(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Ver códigos de barra"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
            <div className="flex items-start justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Códigos de Barras
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black rounded-full p-1"
                onClick={() => setModalOpen(false)}
              >
                <span className="sr-only">Cerrar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {codigosModal.length > 0 ? (
                <ul className="space-y-2">
                  {codigosModal.map((codigo, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <span className="font-mono">{codigo}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No hay códigos de barra disponibles para este dispositivo.</p>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                onClick={() => setModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
