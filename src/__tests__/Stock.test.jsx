import React from 'react';
vi.mock('axios');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Stock from '../pages/Stock';
import axios from 'axios';

describe('Stock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('renderiza título y mensaje de tabla vacía', async () => {
    axios.get.mockResolvedValueOnce({ data: { productos: [], accesorios: [] } }); // stock
    axios.get.mockResolvedValueOnce({ data: [] }); // categorias
    render(<Stock />);
    expect(await screen.findByText(/stock disponible/i)).toBeInTheDocument();
    expect(await screen.findByText(/no se encontraron dispositivos ni accesorios/i)).toBeInTheDocument();
  });

  it('renderiza productos y accesorios obtenidos', async () => {
    axios.get.mockResolvedValueOnce({ data: {
      productos: [
        { tipo: 'dispositivo', codigoModelo: 'M1', nombreEquipo: 'iPhone', color: 'Negro', capacidad: '128GB', cantidad: 2, codigoB: ['CB1', 'CB2'] }
      ],
      accesorios: [
        { codigoModeloAccs: 'A1', nombreAccs: 'Cargador', cantidad: 1, codigosBarras: ['CA1'] }
      ]
    }});
    axios.get.mockResolvedValueOnce({ data: [{ _id: 'cat1', nombreCategoria: 'Celulares' }] });
    render(<Stock />);
    expect(await screen.findByText((c) => /stock disponible/i.test(c))).toBeInTheDocument();
    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.getByText('Cargador')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('filtra por nombre', async () => {
    axios.get.mockResolvedValueOnce({ data: { productos: [], accesorios: [] } }); // stock inicial
    axios.get.mockResolvedValueOnce({ data: [] }); // categorias
    render(<Stock />);
    // Simula escribir en el filtro de nombre y click en filtrar
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'iPhone' } });
    axios.get.mockResolvedValueOnce({ data: {
      productos: [
        { tipo: 'dispositivo', codigoModelo: 'M1', nombreEquipo: 'iPhone', color: 'Negro', capacidad: '128GB', cantidad: 2, codigoB: ['CB1', 'CB2'] }
      ],
      accesorios: []
    }});
    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    expect(await screen.findByText('iPhone')).toBeInTheDocument();
  });

  it('filtra por capacidad', async () => {
    axios.get.mockResolvedValueOnce({ data: { productos: [], accesorios: [] } }); // stock inicial
    axios.get.mockResolvedValueOnce({ data: [] }); // categorias
    render(<Stock />);
    fireEvent.change(screen.getByPlaceholderText(/capacidad/i), { target: { value: '128GB' } });
    axios.get.mockResolvedValueOnce({ data: {
      productos: [
        { tipo: 'dispositivo', codigoModelo: 'M1', nombreEquipo: 'iPhone', color: 'Negro', capacidad: '128GB', cantidad: 2, codigoB: ['CB1', 'CB2'] }
      ],
      accesorios: []
    }});
    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    expect(await screen.findByText('iPhone')).toBeInTheDocument();
  });

  it('filtra por categoría', async () => {
    axios.get.mockResolvedValueOnce({ data: { productos: [], accesorios: [] } }); // stock inicial
    axios.get.mockResolvedValueOnce({ data: [{ _id: 'cat1', nombreCategoria: 'Celulares' }] }); // categorias
    render(<Stock />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Celulares' } });
    axios.get.mockResolvedValueOnce({ data: {
      productos: [
        { tipo: 'dispositivo', codigoModelo: 'M1', nombreEquipo: 'iPhone', color: 'Negro', capacidad: '128GB', cantidad: 2, codigoB: ['CB1', 'CB2'] }
      ],
      accesorios: []
    }});
    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    expect(await screen.findByText('iPhone')).toBeInTheDocument();
  });

  it('abre y cierra el modal de códigos', async () => {
    axios.get.mockResolvedValueOnce({ data: {
      productos: [
        { tipo: 'dispositivo', codigoModelo: 'M1', nombreEquipo: 'iPhone', color: 'Negro', capacidad: '128GB', cantidad: 2, codigoB: ['CB1', 'CB2'] }
      ],
      accesorios: []
    }});
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Stock />);
    expect(await screen.findByText('iPhone')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Ver códigos de barra'));
    expect(await screen.findByText(/códigos de barras/i)).toBeInTheDocument();
    expect(screen.getByText('CB1')).toBeInTheDocument();
    const cerrarBtns = screen.getAllByRole('button', { name: /cerrar/i });
    // El segundo botón es el visible en el modal
    fireEvent.click(cerrarBtns[1]);
    await waitFor(() => {
      expect(screen.queryByText(/códigos de barras/i)).not.toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si la API falla', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error API'));
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Stock />);
    expect(await screen.findByText(/error al cargar el stock/i)).toBeInTheDocument();
  });
});
