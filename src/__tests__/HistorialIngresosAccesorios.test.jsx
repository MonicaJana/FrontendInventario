import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistorialIngresosAccesorios from '../pages/HistorialIngresosAccesorios';
import axios from 'axios';
import React from 'react';

vi.mock('axios');

describe('HistorialIngresosAccesorios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('renderiza título y mensaje de tabla vacía', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<HistorialIngresosAccesorios />);
    expect(await screen.findByText(/historial de accesorios ingresados/i)).toBeInTheDocument();
    expect(await screen.findByText(/no hay registros de ingresos/i)).toBeInTheDocument();
  });

  it('renderiza accesorios obtenidos', async () => {
    const accesorios = [
      {
        _id: '1',
        fechaIngreso: '2024-06-01T12:00:00Z',
        responsableAccs: [{ nombre: 'Juan' }],
        locacionAccs: 'Bodega',
        nombreAccs: 'Cargador',
        precioAccs: 20,
        codigoBarrasAccs: 'CB1',
        codigoModeloAccs: 'CM1',
        disponibilidadAccs: 'Disponible',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: accesorios });
    render(<HistorialIngresosAccesorios />);
    expect(await screen.findByText((c) => /cargador/i.test(c))).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Bodega')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  it('filtra por fecha correctamente', async () => {
    // Primer get: carga inicial
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '1', fechaIngreso: '2024-06-01T12:00:00Z', responsableAccs: [{ nombre: 'Juan' }], locacionAccs: 'Bodega', nombreAccs: 'Cargador', precioAccs: 20 }
    ] });
    // Segundo get: filtrado
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '2', fechaIngreso: '2024-06-10T12:00:00Z', responsableAccs: [{ nombre: 'Ana' }], locacionAccs: 'Tienda', nombreAccs: 'Cable', precioAccs: 10 }
    ] });
    render(<HistorialIngresosAccesorios />);
    expect(await screen.findByText((c) => /cargador/i.test(c))).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2024-06-10' } });
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2024-06-11' } });
    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    expect(await screen.findByText((c) => /cable/i.test(c))).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('abre y cierra el modal de detalle', async () => {
    const accesorios = [
      {
        _id: '1',
        fechaIngreso: '2024-06-01T12:00:00Z',
        responsableAccs: [{ nombre: 'Juan' }],
        locacionAccs: 'Bodega',
        nombreAccs: 'Cargador',
        precioAccs: 20,
        codigoBarrasAccs: 'CB1',
        codigoModeloAccs: 'CM1',
        disponibilidadAccs: 'Disponible',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: accesorios });
    render(<HistorialIngresosAccesorios />);
    expect(await screen.findByText((c) => /cargador/i.test(c))).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Ver detalle'));
    expect(await screen.findByText(/detalle del accesorio/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre:/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
    await waitFor(() => {
      expect(screen.queryByText(/detalle del accesorio/i)).not.toBeInTheDocument();
    });
  });

  it('maneja error de API al listar accesorios', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error API'));
    render(<HistorialIngresosAccesorios />);
    expect(await screen.findByText(/no hay registros de ingresos/i)).toBeInTheDocument();
  });
});
