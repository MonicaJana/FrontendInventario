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
        <div className="p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Dispositivos Registrados</h1>
            <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => setModalOpen(true)}
            >
            + Registrar Dispositivo
            </button>
        </div>
        <TableDispositivos dispositives={dispositives} listDispositives={listDispositives}/>
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
