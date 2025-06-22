import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegistrarVentas from '../pages/RegistrarVentas'
import axios from 'axios'

// Mocks
vi.mock('axios')
vi.mock('../components/Alerts/Message', () => ({
  default: ({ children }) => <div data-testid="message">{children}</div>
}))

describe('RegistrarVentas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    window.confirm = vi.fn(() => true)
  })

  it('renderiza título, campos y botón', () => {
    render(<RegistrarVentas />)
    expect(screen.getByText('Registrar Venta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingrese la cédula del cliente')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingrese el nombre del cliente')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar venta/i })).toBeInTheDocument()
  })

  it('valida campos requeridos', async () => {
    render(<RegistrarVentas />)
    fireEvent.click(screen.getByRole('button', { name: /registrar venta/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Cédula, nombre del cliente y método de pago son obligatorios')
    })
  })

  it('valida cédula incorrecta', async () => {
    render(<RegistrarVentas />)
    fireEvent.change(screen.getByPlaceholderText('Ingrese la cédula del cliente'), { target: { value: '123' } })
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del cliente'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Método de Pago'), { target: { value: 'Efectivo' } })
    fireEvent.click(screen.getByRole('button', { name: /registrar venta/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('La cédula debe tener exactamente 10 dígitos numéricos')
    })
  })

  it('valida nombre muy corto', async () => {
    render(<RegistrarVentas />)
    fireEvent.change(screen.getByPlaceholderText('Ingrese la cédula del cliente'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del cliente'), { target: { value: 'Jo' } })
    fireEvent.change(screen.getByLabelText('Método de Pago'), { target: { value: 'Efectivo' } })
    fireEvent.click(screen.getByRole('button', { name: /registrar venta/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('El nombre del cliente debe tener al menos 3 caracteres')
    })
  })

  it('valida que se agregue al menos un producto o accesorio', async () => {
    render(<RegistrarVentas />)
    fireEvent.change(screen.getByPlaceholderText('Ingrese la cédula del cliente'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del cliente'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Método de Pago'), { target: { value: 'Efectivo' } })
    fireEvent.click(screen.getByRole('button', { name: /registrar venta/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Debe agregar al menos un dispositivo o accesorio a la venta')
    })
  })

  it('valida documento para transferencia/tarjeta', async () => {
    render(<RegistrarVentas />)
    fireEvent.change(screen.getByPlaceholderText('Ingrese la cédula del cliente'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del cliente'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Método de Pago'), { target: { value: 'Transferencia' } })
    // Mock de axios.get para accesorio
    axios.get.mockResolvedValueOnce({ data: { accesorio: { codigoBarrasAccs: 'A1', nombreAccs: 'Cargador', precioAccs: 10 } } })
    fireEvent.change(screen.getByPlaceholderText('Ingrese código de barras del accesorio'), { target: { value: 'A1' } })
    fireEvent.click(screen.getAllByRole('button', { name: '' })[1]) // Botón de agregar accesorio
    await waitFor(() => {
      expect(screen.getByText('A1')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /registrar venta/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Debe ingresar número y descripción de documento para el método seleccionado')
    })
  })

  it('registra venta exitosamente', async () => {
    axios.post.mockResolvedValueOnce({ data: { msg: 'Venta registrada' } })
    render(<RegistrarVentas />)
    fireEvent.change(screen.getByPlaceholderText('Ingrese la cédula del cliente'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del cliente'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Método de Pago'), { target: { value: 'Efectivo' } })
    // Simula agregar un producto
    fireEvent.change(screen.getByPlaceholderText('Ingrese código de barras del dispositivo'), { target: { value: 'PROD1' } })
    // Mock de axios.get para producto
    axios.get.mockResolvedValueOnce({ data: { producto: { codigoBarras: 'PROD1', codigoSerial: 'SER1', nombreEquipo: 'Equipo1', color: 'Negro', capacidad: '128GB', precio: 100 } } })
    fireEvent.click(screen.getAllByRole('button', { name: '' })[0]) // Botón de agregar producto
    await waitFor(() => {
      expect(screen.getByText('Equipo1')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /registrar venta/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Venta registrada')
    })
  })

  it('muestra error si la API falla', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { msg: 'Error API' } } })
    render(<RegistrarVentas />)
    fireEvent.change(screen.getByPlaceholderText('Ingrese la cédula del cliente'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del cliente'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Método de Pago'), { target: { value: 'Efectivo' } })
    // Simula agregar un producto
    fireEvent.change(screen.getByPlaceholderText('Ingrese código de barras del dispositivo'), { target: { value: 'PROD1' } })
    axios.get.mockResolvedValueOnce({ data: { producto: { codigoBarras: 'PROD1', codigoSerial: 'SER1', nombreEquipo: 'Equipo1', color: 'Negro', capacidad: '128GB', precio: 100 } } })
    fireEvent.click(screen.getAllByRole('button', { name: '' })[0])
    await waitFor(() => {
      expect(screen.getByText('Equipo1')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /registrar venta/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Error API')
    })
  })
})
