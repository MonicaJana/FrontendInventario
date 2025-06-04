import { useState, useEffect } from "react";
import ModalDispositivos from "../components/Modals/ModalDispositivos"
import TableDispositivos from "../components/TableDispositives"
import axios from "axios"

const Dispositivos =() => {
    const [dispositives, setDispositives] = useState([])
    const [modalOpen, setModalOpen] = useState(false)

    const listDispositives = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/listarProductos`
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
    
            const response = await axios.get(url, options);
            console.log(response)
            setDispositives(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listDispositives();
    },[]);

    const handleAddDispositive = (newDispositive) => {
        setModalOpen(false);
        listDispositives();
    }

    return(
        <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-black text-center sm:text-left">
                    Dispositivos Registrados
                </h1>
                <button
                    className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => setModalOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Registrar Dispositivo</span>
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow">
                <TableDispositivos dispositives={dispositives} listDispositives={listDispositives}/>
            </div>

            {modalOpen && (
                <ModalDispositivos
                    onClose={() => setModalOpen(false)}
                    listDispositives={listDispositives}
                    dispositive={null}
                    onGuardar={handleAddDispositive}
                />
            )}
        </div>
    );
}
export default Dispositivos;
