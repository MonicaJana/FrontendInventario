import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Login } from '../pages/Login'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock del contexto de autenticación
const mockAuthContext = {
  setAuth: vi.fn(),
  perfil: vi.fn()
}

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Función auxiliar para encontrar mensajes
const findMessage = async (text) => {
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(text);
  return alert;
};

const renderLogin = () => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login form correctly', () => {
    renderLogin()
    
    expect(screen.getByText('SISTEMA DE INVENTARIO')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tus datos para iniciar sesión')).toBeInTheDocument()
    expect(screen.getByLabelText(/Ingresa tu correo electrónico:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    renderLogin()
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    const errorMessage = await findMessage('Todos los campos son obligatorios')
    expect(errorMessage).toBeInTheDocument()
  })

  it('validates email format', async () => {
  renderLogin()

  const emailInput = screen.getByLabelText(/Ingresa tu correo electrónico:/i)
  const passwordInput = screen.getByLabelText(/Contraseña:/i)

  fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
  fireEvent.change(passwordInput, { target: { value: '123456' } })

  const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
  fireEvent.click(submitButton)

  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent('Ingrese un correo electrónico válido')
})

  it('validates password length', async () => {
    renderLogin()
    
    const emailInput = screen.getByLabelText(/Ingresa tu correo electrónico:/i)
    const passwordInput = screen.getByLabelText(/Contraseña:/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    const errorMessage = await findMessage('La contraseña debe tener al menos 6 caracteres')
    expect(errorMessage).toBeInTheDocument()
  })

it('handles successful login', async () => {
    const mockResponse = {
      data: {
        token: 'mock-token'
      }
    }
    
    axios.post.mockResolvedValueOnce(mockResponse)
    
    renderLogin()

    const emailInput = screen.getByLabelText(/Ingresa tu correo electrónico:/i)
    const passwordInput = screen.getByLabelText(/Contraseña:/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          email: 'test@example.com',
          password: '123456'
        })
      )
      expect(localStorage.getItem('token')).toBe('mock-token')
      expect(mockAuthContext.setAuth).toHaveBeenCalledWith(mockResponse.data)
      expect(mockAuthContext.perfil).toHaveBeenCalledWith('mock-token')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/stock')
    })
  })

  it('handles login failure', async () => {
    const errorMessage = 'Credenciales inválidas'
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          msg: errorMessage
        }
      }
    })
    
    renderLogin()
    
    const emailInput = screen.getByLabelText(/Ingresa tu correo electrónico:/i)
    const passwordInput = screen.getByLabelText(/Contraseña:/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    const error = await findMessage(errorMessage)
    expect(error).toBeInTheDocument()
    expect(passwordInput.value).toBe('') // La contraseña debe limpiarse
    expect(emailInput.value).toBe('test@example.com') // El email debe mantenerse
  })
})
