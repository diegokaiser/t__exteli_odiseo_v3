import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import DataCustomer from '@/components/organisms/DataCustomer/DataCustomer';

// Mock de useAuth
jest.mock('@/auth/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock de useCustomer
jest.mock('@/hooks/useCustomer', () => ({
  useCustomer: jest.fn(),
}));

// Mock de useNationalities
jest.mock('@/hooks/useNationality', () => ({
  useNationalities: jest.fn(),
}));

import { useAuth } from '@/auth/hooks/useAuth';
import { useCustomer } from '@/hooks/useCustomer';
import { useNationalities } from '@/hooks/useNationality';

describe('DataCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar todos los campos con valores correctos cuando el usuario es admin', () => {
    // Mock user admin
    (useAuth as jest.Mock).mockReturnValue({
      user: { labels: ['Administrador'] },
    });

    // Mock customer data
    (useCustomer as jest.Mock).mockReturnValue({
      data: {
        firstName: 'Sandalio',
        lastName: 'Meltronco Choro',
        email: 'sand@example.com',
        gender: 'Masculino',
        birthday: '1990-01-01',
        nationality: 'Peruano',
        phone: '654321987',
        messenger: 'Sí',
        documentType: 'DNI',
        documentNumber: '123456789X',
        enterDate: '2022-01-01',
        agent: 'Agent Smith',
        status: 'Activo',
      },
      isLoading: false,
      isError: false,
    });

    // Mock nacionalities loaded
    (useNationalities as jest.Mock).mockReturnValue({
      data: [{ country: 'Peruano' }, { country: 'Español' }],
      isLoading: false,
      isError: false,
    });

    render(<DataCustomer customerId="1" />);

    expect(screen.getByDisplayValue('Sandalio')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Meltronco Choro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sand@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('654321987')).toBeInTheDocument();

    // Nacionalidad select
    expect(screen.getByDisplayValue('Peruano')).toBeInTheDocument();

    // Document
    expect(screen.getByDisplayValue('123456789X')).toBeInTheDocument();
  });

  it('debe deshabilitar los campos si el usuario NO es admin', () => {
    // Mock user NOT admin
    (useAuth as jest.Mock).mockReturnValue({
      user: { labels: ['Usuario'] },
    });

    // Mock customer
    (useCustomer as jest.Mock).mockReturnValue({
      data: {
        firstName: 'Sandalio',
        lastName: 'Meltronco Choro',
        email: 'sand@example.com',
      },
      isLoading: false,
      isError: false,
    });

    // Mock nacionalities
    (useNationalities as jest.Mock).mockReturnValue({
      data: [{ country: 'Peruano' }],
      isLoading: false,
      isError: false,
    });

    render(<DataCustomer customerId="1" />);

    // Campo habilitado/deshabilitado
    expect(screen.getByDisplayValue('Sandalio')).toBeDisabled();
    expect(screen.getByDisplayValue('sand@example.com')).toBeDisabled();

    // Nacionalidad select
    const selects = screen.getAllByRole('combobox');
    selects.forEach((select) => {
      expect(select).toBeDisabled();
    });
  });

  it('debe mostrar loader cuando nationalities están cargando', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { labels: ['Administrador'] } });
    (useCustomer as jest.Mock).mockReturnValue({
      data: { firstName: 'Sandalio', lastName: 'Choro' },
      isLoading: false,
      isError: false,
    });

    (useNationalities as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    const { container } = render(<DataCustomer customerId="1" />);

    const loader = container.querySelector('svg.animate-spin');
    expect(loader).toBeInTheDocument();
  });
});
