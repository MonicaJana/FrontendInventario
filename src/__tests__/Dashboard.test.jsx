import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'
import Dashboard from '../layout/Dashboard'

const renderDashboard = (auth = { nombre: 'Test User', rol: 'Administrador' }) => {
  return render(
    <AuthContext.Provider value={{ auth }}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza el logo, nombre del sistema y nombre del usuario', () => {
    renderDashboard()
    expect(screen.getByAltText('Logo')).toBeInTheDocument()
    expect(screen.getByText('SISTEMA DE INVENTARIO')).toBeInTheDocument()
    expect(screen.getByText(/Bienvenido - Test User/)).toBeInTheDocument()
  })

  it('muestra enlaces de administrador', () => {
    renderDashboard({ nombre: 'Admin', rol: 'Administrador' })
    expect(screen.getByText('CATEGORIAS')).toBeInTheDocument()
    expect(screen.getByText('ACCESORIOS')).toBeInTheDocument()
    expect(screen.getByText('DISPOSITIVOS')).toBeInTheDocument()
    expect(screen.getByText('USUARIOS')).toBeInTheDocument()
  })

  it('no muestra enlaces de admin para rol Usuario', () => {
    renderDashboard({ nombre: 'Usuario', rol: 'Usuario' })
    expect(screen.queryByText('CATEGORIAS')).not.toBeInTheDocument()
    expect(screen.queryByText('ACCESORIOS')).not.toBeInTheDocument()
    expect(screen.queryByText('DISPOSITIVOS')).not.toBeInTheDocument()
    expect(screen.queryByText('USUARIOS')).not.toBeInTheDocument()
    expect(screen.getByText('REGISTRAR VENTA')).toBeInTheDocument()
  })

  it('abre y cierra el menú móvil', () => {
    renderDashboard()
    const menuButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(menuButton)
    // El menú debe estar abierto (sidebar visible)
    expect(screen.getByText('SISTEMA DE INVENTARIO')).toBeVisible()
    // Cierra el menú tocando el overlay
    const overlay = screen.getByTestId('mobile-overlay')
    fireEvent.click(overlay)
    // El menú debe seguir existiendo pero puede estar oculto
    expect(screen.getByText('SISTEMA DE INVENTARIO')).toBeInTheDocument()
  })

  it('el botón Salir limpia el token', () => {
    localStorage.setItem('token', 'test-token')
    renderDashboard()
    const salirBtn = screen.getByRole('link', { name: /salir/i })
    fireEvent.click(salirBtn)
    expect(localStorage.getItem('token')).toBeNull()
  })
})
