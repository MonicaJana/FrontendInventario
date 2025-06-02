import {useState, useEffect} from "react"
import ModalAccesory from "../components/Modals/ModalAccesory"
import TableAccesories from "../components/TableAccesories"
import axios from "axios"


const Accesories = () => {
    const [accesories, setAccesories] = useState([])
    const [modalOpen, setModalOpen] = useState(false)

    const listAccesories = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/listarAccesorios`
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
    
            const response = await axios.get(url, options);
            setAccesories(response.data)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        listAccesories();
    }, []);

    const handleAddAccesory = (newAccesory) =>{
        setModalOpen(false);
        listAccesories();
    }

    return(
        <div className="p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Accesorios Registrados</h1>
            <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => setModalOpen(true)}
            >
            + Registrar Accesorio
            </button>
        </div>
        <TableAccesories accesories={accesories} listAccesories={listAccesories}/>
            {modalOpen && (
            <ModalAccesory
            onClose={() => setModalOpen(false)}
            listAccesories={listAccesories}
            accesory={null}
            onGuardar={handleAddAccesory}
            />
        )}
        </div>
    );
}
export default Accesories;