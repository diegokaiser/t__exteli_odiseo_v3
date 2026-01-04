import CustomersPage from '@/app/(dashboard)/customers/page';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('@/hooks/useCustomer', () => ({
  useCustomers: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

jest.mock('@/components/atoms', () => ({
  LoadingScreen: () => <div data-testid="loading-screen">LoadingScreen</div>,
  Message: ({ detail }: any) => <div data-testid="error-message">{detail}</div>,
}));

import { useCustomers } from '@/hooks/useCustomer';

const mockedUseCustomers = useCustomers as jest.Mock;

describe('CustomersPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el componente de carga mientras se obtienen datos', () => {
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });
    render(<CustomersPage />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si hay un error al obtener los datos', () => {
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });
    render(<CustomersPage />);
    expect(screen.getByTestId('error-message')).toHaveTextContent('Error al cargar los clientes');
  });

  it('renderiza Breadcrumbs y tabla con datos cuando hay clientes', async () => {
    mockedUseCustomers.mockReturnValue({
      data: [
        {
          id: '1',
          firstName: 'Sandalio',
          documentNumber: '123456789X',
          phone: '654321987',
          nationality: 'Peruano',
          enterDate: '2022-01-01',
          agent: 'Agente Perry',
          status: 'Activo',
        },
      ],
      isLoading: false,
      isError: false,
    });
    render(<CustomersPage />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Sandalio')).toBeInTheDocument());
    expect(screen.getByText('123456789X')).toBeInTheDocument();
    expect(screen.getByText('654321987')).toBeInTheDocument();
    expect(screen.getByText('Peruano')).toBeInTheDocument();
    expect(screen.getByText('2022-01-01')).toBeInTheDocument();
    expect(screen.getByText('Agente Perry')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('muestra mensaje de "No hay clientes" si el array esta vacio', async () => {
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    render(<CustomersPage />);
    expect(await screen.findByText('No hay clientes')).toBeInTheDocument();
  });
});
