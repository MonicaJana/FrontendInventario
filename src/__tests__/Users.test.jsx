import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Users from '../pages/Users'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock de componentes hijos
vi.mock('../components/Modals/ModalUser', () => ({
  default: ({ onClose, onGuardar }) => (
    <div data-testid="modal-user">
      <p>Mock Modal</p>
      <button onClick={() => {
        onGuardar?.({ nombre: 'Juan' });
        onClose();
      }}>REGISTRAR</button>
    </div>
  )
}));

vi.mock('../components/TableUsers', () => ({
  default: ({ users }) => (
    <div data-testid="table-users">
      {users.length ? users.map(u => <div key={u.cedula}>{u.nombre} {u.apellido}</div>) : 'Sin usuarios'}
    </div>
  )
}))

describe('Users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza el título y el botón', () => {
    render(<Users />)
    expect(screen.getByText('Usuarios Registrados')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar usuario/i })).toBeInTheDocument()
  })

  it('llama a listUsers al montar y muestra datos', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ cedula: '1', nombre: 'Juan', apellido: 'Pérez' }] })
    render(<Users />)
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    })
  })

  it('muestra loading mientras carga', () => {
    render(<Users />)
    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument()
  })

  it('muestra error si la API falla', async () => {
    axios.get.mockRejectedValueOnce({})
    render(<Users />)
    await waitFor(() => {
      expect(screen.getByText('Error al cargar los usuarios. Por favor, intente nuevamente.')).toBeInTheDocument()
    })
  })

it('abre el modal al hacer clic en Registrar Usuario', async () => {
  axios.get.mockResolvedValueOnce({ data: [] }) 

  render(<Users />)

  const btn = await screen.findByRole('button', { name: /registrar usuario/i })
  fireEvent.click(btn)

  expect(await screen.findByTestId('modal-user')).toBeInTheDocument()
})

it('cierra el modal y actualiza la lista al guardar', async () => {
        axios.get.mockResolvedValue({ data: [{ cedula: '1', nombre: 'Juan', apellido: 'Pérez' }] })
        render(<Users />)
        const btn = await screen.findByRole('button', { name: /registrar usuario/i })
        fireEvent.click(btn)
    
        const guardarBtn = screen.getByText('REGISTRAR')
        fireEvent.click(guardarBtn)
    
        await waitFor(() => {
        expect(screen.queryByTestId('modal-user')).not.toBeInTheDocument()
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })
    })
})
