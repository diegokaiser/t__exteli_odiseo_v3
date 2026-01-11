import BillingPage from '@/app/(dashboard)/billing/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/hooks/useBills', () => ({
  useBills: () => ({
    data: [
      {
        id: '1',
        number: '1',
        customer: 'Sandalio Meltronco',
        createDate: '2024-05-01',
        total: 120.5,
        status: 'pendiente',
      },
    ],
    isLoading: false,
    isError: false,
  }),
  usePaidBill: () => ({
    mutate: jest.fn(),
    isLoading: false,
  }),
  useCancelBill: () => ({
    mutate: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

describe('BillingPage', () => {
  it('renderiza la tabla de facturacion con una factura', () => {
    render(<BillingPage />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    //expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Sandalio Meltronco')).toBeInTheDocument();
    expect(screen.getByText('2024-05-01')).toBeInTheDocument();
    expect(screen.getByText('120.5')).toBeInTheDocument();
    expect(screen.getByText('pendiente')).toBeInTheDocument();
  });
});
