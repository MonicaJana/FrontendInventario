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
        <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-black">Accesorios Registrados</h1>
                <button
                    className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => setModalOpen(true)}
                >
                    <span className="w-5 h-5 flex items-center justify-center">+</span>
                    Registrar Accesorio
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <TableAccesories accesories={accesories} listAccesories={listAccesories}/>
            </div>

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