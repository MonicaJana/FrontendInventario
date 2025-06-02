import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Login } from './pages/Login'
import Dashboard from './layout/Dashboard'
import Users from './pages/Users'
import { AuthProvider } from './context/AuthProvider'
import Categories from './pages/Categories'
import Accesories from './pages/Accesories'
import Reset from './pages/Reset'
import Dispositives from './pages/Dispositivos'
import RegistrarVentas from './pages/RegistrarVentas'
import HistorialVentas from './pages/HistorialVentas'
import HistorialMovimientos from './pages/HistorialMovimientos'
import HistorialIngresosDispositivos from './pages/HistorialIngresosDispositivos'
import HistorialIngresosAccesorios from './pages/HistorialIngresosAccesorios'
import Stock from './pages/Stock'

function App () {
  return (
    <>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          <Route path="reset/:token" element={<Reset/>}/>
          <Route path="/" element={<Login/>} />
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="stock" element={<Stock/>} />
              <Route path="users" element={<Users/>} />
              <Route path="categories" element={<Categories/>} />
              <Route path="accesories" element={<Accesories/>} />
              <Route path="dispositives" element={<Dispositives/>} />
              <Route path="sales" element={<RegistrarVentas/>} />
              <Route path="historyDispositives" element={<HistorialIngresosDispositivos/>} />
              <Route path="historyAccesories" element={<HistorialIngresosAccesorios/>} />
              <Route path="historySales" element={<HistorialVentas/>}/>
              <Route path="historyMoves" element={<HistorialMovimientos/>}/>
            </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App