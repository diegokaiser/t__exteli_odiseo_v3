import DashboardPage from '@/app/(dashboard)/dashboard/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock del HOC
jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

// Mock de hooks
jest.mock('@/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      labels: ['Administrador'],
    },
  }),
}));

jest.mock('@/hooks/useBills', () => ({
  useGetBillsByStatus: (status: string) => ({
    data: [
      {
        id: `bill-${status}`,
        customer: 'Cliente Demo',
        billSerial: 'A',
        billNumber: '001',
        total: 100,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

// Mock de componentes usados
jest.mock('@/components/organisms', () => ({
  CardCalendar: () => <div data-testid="card-calendar" />,
  DashboardBill: ({ status }: { status: string }) => (
    <div data-testid={`dashboard-bill-${status}`} />
  ),
  DashboardBillCount: ({ status }: { status: string }) => (
    <div data-testid={`dashboard-bill-count-${status}`} />
  ),
  CardBill: ({ type }: { type: string }) => <div data-testid={`card-bill-${type}`} />,
}));

describe('DashboardPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza los bloques principales del dashboard', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('card-calendar')).toBeInTheDocument();

    const paidBills = screen.getAllByTestId('dashboard-bill-Pagado');
    expect(paidBills).toHaveLength(2);

    expect(screen.getByTestId('dashboard-bill-pendiente')).toBeInTheDocument();

    expect(screen.getByTestId('card-bill-approved')).toBeInTheDocument();
    expect(screen.getByTestId('card-bill-pending')).toBeInTheDocument();
    expect(screen.getByTestId('card-bill-cancelled')).toBeInTheDocument();
  });
});
