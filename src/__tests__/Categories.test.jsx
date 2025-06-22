import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Categories from '../pages/Categories'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock de componentes hijos
vi.mock('../components/Modals/ModalCategory', () => ({
  default: ({ onClose, onGuardar }) => (
    <div data-testid="modal-category">
      ModalCategory
      <button onClick={() => { onGuardar && onGuardar({ nombre: 'Nueva' }) }}>Guardar</button>
      <button onClick={onClose}>Cerrar</button>
    </div>
  )
}))
vi.mock('../components/TableCategories', () => ({
  default: ({ categories }) => (
    <div data-testid="table-categories">
      {categories.length ? categories.map(cat => <div key={cat._id}>{cat.nombreCategoria}</div>) : 'Sin categorias'}
    </div>
  )
}))

describe('Categories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza el título y el botón', () => {
    render(<Categories />)
    expect(screen.getByText('Categorias Registradas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar categoria/i })).toBeInTheDocument()
  })

  it('llama a listCategories al montar', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ _id: '1', nombreCategoria: 'Cat1' }] })
    render(<Categories />)
    await waitFor(() => {
      expect(screen.getByText('Cat1')).toBeInTheDocument()
    })
  })

  it('muestra el modal al hacer clic en Registrar Categoria', () => {
    render(<Categories />)
    const btn = screen.getByRole('button', { name: /registrar categoria/i })
    fireEvent.click(btn)
    expect(screen.getByTestId('modal-category')).toBeInTheDocument()
  })

  it('cierra el modal y actualiza la lista al guardar', async () => {
    axios.get.mockResolvedValue({ data: [{ _id: '1', nombreCategoria: 'Cat1' }] })
    render(<Categories />)
    const btn = screen.getByRole('button', { name: /registrar categoria/i })
    fireEvent.click(btn)
    const guardarBtn = screen.getByText('Guardar')
    fireEvent.click(guardarBtn)
    await waitFor(() => {
      expect(screen.queryByTestId('modal-category')).not.toBeInTheDocument()
    })
  })
})
