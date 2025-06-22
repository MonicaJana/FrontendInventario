import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Accesories from '../pages/Accesories'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock de componentes hijos
vi.mock('../components/Modals/ModalAccesory', () => ({
  default: ({ onClose, onGuardar }) => (
    <div data-testid="modal-accesory">
      ModalAccesory
      <button onClick={() => { onGuardar && onGuardar({ nombre: 'Nuevo' }) }}>Guardar</button>
      <button onClick={onClose}>Cerrar</button>
    </div>
  )
}))
vi.mock('../components/TableAccesories', () => ({
  default: ({ accesories }) => (
    <div data-testid="table-accesories">
      {accesories.length ? accesories.map(a => <div key={a._id}>{a.nombreAccs}</div>) : 'Sin accesorios'}
    </div>
  )
}))

describe('Accesories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza el título y el botón', () => {
    render(<Accesories />)
    expect(screen.getByText('Accesorios Registrados')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar accesorio/i })).toBeInTheDocument()
  })

  it('llama a listAccesories al montar y muestra datos', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ _id: '1', nombreAccs: 'Mouse' }] })
    render(<Accesories />)
    await waitFor(() => {
      expect(screen.getByText('Mouse')).toBeInTheDocument()
    })
  })

  it('muestra la tabla con Sin accesorios si no hay datos', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    render(<Accesories />)
    await waitFor(() => {
      expect(screen.getByText('Sin accesorios')).toBeInTheDocument()
    })
  })

  it('abre el modal al hacer clic en Registrar Accesorio', () => {
    render(<Accesories />)
    const btn = screen.getByRole('button', { name: /registrar accesorio/i })
    fireEvent.click(btn)
    expect(screen.getByTestId('modal-accesory')).toBeInTheDocument()
  })

  it('cierra el modal y recarga la lista al guardar', async () => {
    axios.get.mockResolvedValue({ data: [{ _id: '1', nombreAccs: 'Mouse' }] })
    render(<Accesories />)
    const btn = screen.getByRole('button', { name: /registrar accesorio/i })
    fireEvent.click(btn)
    const guardarBtn = screen.getByText('Guardar')
    fireEvent.click(guardarBtn)
    await waitFor(() => {
      expect(screen.queryByTestId('modal-accesory')).not.toBeInTheDocument()
    })
  })
})
