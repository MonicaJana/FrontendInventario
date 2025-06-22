import React from 'react';
vi.mock('../components/Alerts/Message', () => ({
  default: ({ children }) => <div data-testid="message">{children}</div>
}));
vi.mock('axios');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistorialMovimientos from '../pages/HistorialMovimientos';
import axios from 'axios';

describe('HistorialMovimientos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    window.confirm = vi.fn(() => true);
  });

  it('renderiza título y mensaje de tabla vacía', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<HistorialMovimientos />);
    expect(await screen.findByText(/historial movimientos/i)).toBeInTheDocument();
    expect(await screen.findByText(/no hay registros de movimientos/i)).toBeInTheDocument();
  });

  it('renderiza movimientos obtenidos', async () => {
    const movimientos = [
      {
        _id: '1',
        fecha: '2024-06-01T12:00:00Z',
        responsable: [{ nombreResponsable: 'Juan' }],
        areaSalida: 'Bodega',
        areaLlegada: 'Tienda',
        observacion: 'Movimiento normal',
        productos: [],
        accesorios: [],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: movimientos });
    render(<HistorialMovimientos />);
    expect(await screen.findByText((c) => /historial movimientos/i.test(c))).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Bodega')).toBeInTheDocument();
    expect(screen.getByText('Tienda')).toBeInTheDocument();
  });

  it('filtra por fecha correctamente', async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '1', fecha: '2024-06-01T12:00:00Z', responsable: [{ nombreResponsable: 'Juan' }], areaSalida: 'Bodega', areaLlegada: 'Tienda', observacion: 'Movimiento normal', productos: [], accesorios: [] }
    ] });
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '2', fecha: '2024-06-10T12:00:00Z', responsable: [{ nombreResponsable: 'Ana' }], areaSalida: 'Bodega', areaLlegada: 'Sucursal', observacion: 'Movimiento especial', productos: [], accesorios: [] }
    ] });
    render(<HistorialMovimientos />);
    expect(await screen.findByText('Juan')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2024-06-10' } });
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2024-06-11' } });
    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Sucursal')).toBeInTheDocument();
  });

  it('abre y cierra el modal de detalle', async () => {
    const movimientos = [
      {
        _id: '1',
        fecha: '2024-06-01T12:00:00Z',
        responsable: [{ nombreResponsable: 'Juan' }],
        areaSalida: 'Bodega',
        areaLlegada: 'Tienda',
        observacion: 'Movimiento normal',
        productos: [],
        accesorios: [],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: movimientos });
    render(<HistorialMovimientos />);
    expect(await screen.findByText('Juan')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Ver detalle'));
    expect(await screen.findByText(/detalle del movimiento/i)).toBeInTheDocument();
    expect(screen.getByText(/responsable:/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
    await waitFor(() => {
      expect(screen.queryByText(/detalle del movimiento/i)).not.toBeInTheDocument();
    });
  });

  it('abre el modal de edición', async () => {
    const movimientos = [
      {
        _id: '1',
        fecha: '2024-06-01T12:00:00Z',
        responsable: [{ nombreResponsable: 'Juan' }],
        areaSalida: 'Bodega',
        areaLlegada: 'Tienda',
        observacion: 'Movimiento normal',
        productos: [],
        accesorios: [],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: movimientos });
    render(<HistorialMovimientos />);
    expect(await screen.findByText('Juan')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Editar'));
    expect(await screen.findByText(/editar movimiento/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Movimiento normal')).toBeInTheDocument();
  });

  it('muestra mensaje de error si la API falla al listar movimientos', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error API'));
    render(<HistorialMovimientos />);
    expect(await screen.findByText(/no hay registros de movimientos/i)).toBeInTheDocument();
  });
});
