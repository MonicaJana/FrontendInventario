import React from 'react';

vi.mock('../context/AuthProvider', () => ({
  __esModule: true,
  default: React.createContext({ auth: { rol: 'Administrador' } })
}));
vi.mock('../components/Alerts/Message', () => ({
  default: ({ children }) => <div data-testid="message">{children}</div>
}));
vi.mock('axios');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistorialVentas from '../pages/HistorialVentas';
import axios from 'axios';

describe('HistorialVentas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    window.confirm = vi.fn(() => true);
  });

  it('renderiza título y mensaje de tabla vacía', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<HistorialVentas />);
    expect(await screen.findByText(/historial ventas/i)).toBeInTheDocument();
    expect(await screen.findByText(/no hay registros de ventas/i)).toBeInTheDocument();
  });

  it('renderiza ventas obtenidas', async () => {
    const ventas = [
      {
        _id: '1',
        fecha: '2024-06-01T12:00:00Z',
        vendedor: [{ nombreVendedor: 'Juan' }],
        metodoPago: 'Efectivo',
        descuento: 10,
        total: 100,
        cliente: { nombre: 'Cliente1', cedula: '1234567890' },
        observacion: 'Venta normal',
        productos: [],
        accesorios: [],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: ventas });
    render(<HistorialVentas />);
    expect(await screen.findByText((c) => /historial ventas/i.test(c))).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('filtra por fecha correctamente', async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '1', fecha: '2024-06-01T12:00:00Z', vendedor: [{ nombreVendedor: 'Juan' }], metodoPago: 'Efectivo', descuento: 10, total: 100, cliente: { nombre: 'Cliente1', cedula: '1234567890' }, observacion: 'Venta normal', productos: [], accesorios: [] }
    ] });
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '2', fecha: '2024-06-10T12:00:00Z', vendedor: [{ nombreVendedor: 'Ana' }], metodoPago: 'Tarjeta', descuento: 5, total: 200, cliente: { nombre: 'Cliente2', cedula: '0987654321' }, observacion: 'Venta especial', productos: [], accesorios: [] }
    ] });
    render(<HistorialVentas />);
    expect(await screen.findByText('Juan')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2024-06-10' } });
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2024-06-11' } });
    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('abre y cierra el modal de detalle', async () => {
    const ventas = [
      {
        _id: '1',
        fecha: '2024-06-01T12:00:00Z',
        vendedor: [{ nombreVendedor: 'Juan' }],
        metodoPago: 'Efectivo',
        descuento: 10,
        total: 100,
        cliente: { nombre: 'Cliente1', cedula: '1234567890' },
        observacion: 'Venta normal',
        productos: [],
        accesorios: [],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: ventas });
    render(<HistorialVentas />);
    expect(await screen.findByText('Juan')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Ver Detalle'));
    expect(await screen.findByText(/detalle de venta/i)).toBeInTheDocument();
    expect(screen.getByText(/cliente:/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
    await waitFor(() => {
      expect(screen.queryByText(/detalle de venta/i)).not.toBeInTheDocument();
    });
  });

  it('abre el modal de edición', async () => {
    const ventas = [
      {
        _id: '1',
        fecha: '2024-06-01T12:00:00Z',
        vendedor: [{ nombreVendedor: 'Juan' }],
        metodoPago: 'Efectivo',
        descuento: 10,
        total: 100,
        cliente: { nombre: 'Cliente1', cedula: '1234567890' },
        observacion: 'Venta normal',
        productos: [],
        accesorios: [],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: ventas });
    render(<HistorialVentas />);
    expect(await screen.findByText('Juan')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Editar'));
    expect(await screen.findByText(/editar venta/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Venta normal')).toBeInTheDocument();
  });

  it('muestra mensaje de error si la API falla al listar ventas', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error API'));
    render(<HistorialVentas />);
    expect(await screen.findByText(/no hay registros de ventas/i)).toBeInTheDocument();
  });
  
});
