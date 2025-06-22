import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Reset from '../pages/Reset'
import axios from 'axios'

// Mocks
vi.mock('axios')
vi.mock('../components/Alerts/Message', () => ({
  default: ({ children }) => <div data-testid="message">{children}</div>
}))
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ token: 'mock-token' })
}))

describe('Reset', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza título, logo y campos', () => {
    render(<Reset />)
    expect(screen.getByText('Cambiar contraseña')).toBeInTheDocument()
    expect(screen.getByAltText('Logo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nueva contraseña')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })

  it('valida campos requeridos', async () => {
    render(<Reset />)
    const btn = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument()
      expect(screen.getByText('La confirmación es obligatoria')).toBeInTheDocument()
    })
  })

  it('muestra error si las contraseñas no coinciden', async () => {
    render(<Reset />)
    fireEvent.change(screen.getByPlaceholderText('Nueva contraseña'), { target: { value: 'abc12345' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'diferente' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Las contraseñas no coinciden')
    })
  })

  it('muestra mensaje de éxito al cambiar contraseña', async () => {
    axios.put.mockResolvedValueOnce({ data: { msg: 'Contraseña cambiada' } })
    render(<Reset />)
    fireEvent.change(screen.getByPlaceholderText('Nueva contraseña'), { target: { value: 'abc12345' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'abc12345' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Contraseña cambiada')
    })
  })

  it('muestra mensaje de error si la API falla', async () => {
    axios.put.mockRejectedValueOnce({ response: { data: { msg: 'Error API' } } })
    render(<Reset />)
    fireEvent.change(screen.getByPlaceholderText('Nueva contraseña'), { target: { value: 'abc12345' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'abc12345' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent('Error API')
    })
  })
})
