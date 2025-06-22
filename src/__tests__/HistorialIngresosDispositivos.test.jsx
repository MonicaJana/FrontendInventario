import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistorialIngresosDispositivos from '../pages/HistorialIngresosDispositivos';
import axios from 'axios';
import React from 'react';

vi.mock('axios');

describe('HistorialIngresosDispositivos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('renderiza título y mensaje de tabla vacía', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<HistorialIngresosDispositivos />);
    expect(await screen.findByText(/historial de dispositivos ingresados/i)).toBeInTheDocument();
    expect(await screen.findByText(/no hay registros de ingresos/i)).toBeInTheDocument();
  });

  it('renderiza dispositivos obtenidos', async () => {
    const dispositivos = [
      {
        _id: '1',
        fechaIngreso: '2024-06-01T12:00:00Z',
        responsable: [{ nombre: 'Juan' }],
        locacion: 'Bodega',
        nombreEquipo: 'iPhone',
        precio: 100,
        codigoBarras: 'CB1',
        codigoSerial: 'CS1',
        codigoModelo: 'CM1',
        capacidad: '128GB',
        color: 'Negro',
        tipo: 'Smartphone',
        estado: 'Nuevo',
        categoriaNombre: [{ nombreCategoria: 'Celulares' }],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: dispositivos });
    render(<HistorialIngresosDispositivos />);
    expect(await screen.findByText((c) => /iphone/i.test(c))).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Bodega')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('filtra por fecha correctamente', async () => {
    // Primer get: carga inicial
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '1', fechaIngreso: '2024-06-01T12:00:00Z', responsable: [{ nombre: 'Juan' }], locacion: 'Bodega', nombreEquipo: 'iPhone', precio: 100 }
    ] });
    // Segundo get: filtrado
    axios.get.mockResolvedValueOnce({ data: [
      { _id: '2', fechaIngreso: '2024-06-10T12:00:00Z', responsable: [{ nombre: 'Ana' }], locacion: 'Tienda', nombreEquipo: 'Samsung', precio: 200 }
    ] });
    render(<HistorialIngresosDispositivos />);
    expect(await screen.findByText((c) => /iphone/i.test(c))).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2024-06-10' } });
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2024-06-11' } });
    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    expect(await screen.findByText((c) => /samsung/i.test(c))).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('abre y cierra el modal de detalle', async () => {
    const dispositivos = [
      {
        _id: '1',
        fechaIngreso: '2024-06-01T12:00:00Z',
        responsable: [{ nombre: 'Juan' }],
        locacion: 'Bodega',
        nombreEquipo: 'iPhone',
        precio: 100,
        codigoBarras: 'CB1',
        codigoSerial: 'CS1',
        codigoModelo: 'CM1',
        capacidad: '128GB',
        color: 'Negro',
        tipo: 'Smartphone',
        estado: 'Nuevo',
        categoriaNombre: [{ nombreCategoria: 'Celulares' }],
      },
    ];
    axios.get.mockResolvedValueOnce({ data: dispositivos });
    render(<HistorialIngresosDispositivos />);
    expect(await screen.findByText((c) => /iphone/i.test(c))).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Ver detalle'));
    expect(await screen.findByText(/detalle del dispositivo/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre del equipo/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
    await waitFor(() => {
      expect(screen.queryByText(/detalle del dispositivo/i)).not.toBeInTheDocument();
    });
  });

  it('maneja error de API al listar dispositivos', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error API'));
    render(<HistorialIngresosDispositivos />);
    expect(await screen.findByText(/no hay registros de ingresos/i)).toBeInTheDocument();
  });
});
