import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Dispositivos from '../pages/Dispositivos'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock de componentes hijos
vi.mock('../components/Modals/ModalDispositivos', () => ({
  default: ({ onClose, onGuardar }) => (
    <div data-testid="modal-dispositivos">
      ModalDispositivos
      <button onClick={onGuardar}>Guardar</button>
      <button onClick={onClose}>Cerrar</button>
    </div>
  )
}))
vi.mock('../components/TableDispositives', () => ({
  default: ({ dispositives }) => (
    <div data-testid="table-dispositives">
      {dispositives.length ? dispositives.map(d => <div key={d._id}>{d.nombreProducto}</div>) : 'Sin dispositivos'}
    </div>
  )
}))

describe('Dispositivos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza el título y el botón', () => {
    render(<Dispositivos />)
    expect(screen.getByText('Dispositivos Registrados')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar dispositivo/i })).toBeInTheDocument()
  })

  it('llama a listDispositives al montar y muestra datos', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ _id: '1', nombreProducto: 'Laptop' }] })
    render(<Dispositivos />)
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument()
    })
  })

  it('muestra loading mientras carga', () => {
    render(<Dispositivos />)
    expect(screen.getByText('Cargando dispositivos...')).toBeInTheDocument()
  })

  it('muestra error si la API falla', async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { msg: 'Error personalizado' } } })
    render(<Dispositivos />)
    await waitFor(() => {
      expect(screen.getByText('Error personalizado')).toBeInTheDocument()
    })
  })

  it('abre el modal al hacer clic en Registrar Dispositivo', () => {
    render(<Dispositivos />)
    const btn = screen.getByRole('button', { name: /registrar dispositivo/i })
    fireEvent.click(btn)
    expect(screen.getByTestId('modal-dispositivos')).toBeInTheDocument()
  })

  it('cierra el modal y recarga la lista al guardar', async () => {
    axios.get.mockResolvedValue({ data: [{ _id: '1', nombreProducto: 'Laptop' }] })
    render(<Dispositivos />)
    const btn = screen.getByRole('button', { name: /registrar dispositivo/i })
    fireEvent.click(btn)
    const guardarBtn = screen.getByText('Guardar')
    fireEvent.click(guardarBtn)
    await waitFor(() => {
      expect(screen.queryByTestId('modal-dispositivos')).not.toBeInTheDocument()
    })
  })
})
