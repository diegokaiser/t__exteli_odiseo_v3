import AddCustomerPage from '@/app/(dashboard)/customers/add/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

// Mock de Breadcrumbs y FormCustomer
jest.mock('@/components/organisms', () => ({
  Breadcrumbs: (props: any) => (
    <div data-testid="breadcrumbs">{props.pageTitle || 'Breadcrumbs'}</div>
  ),
  FormCustomer: () => <div data-testid="form-customer">FormCustomer</div>,
}));

describe('AddCustomerPage', () => {
  it('debe renderizar Breadcrumbs y FormCustomer', () => {
    render(<AddCustomerPage />);

    // Verifica que Breadcrumbs se haya renderizado con el título correcto
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Agregar cliente');

    // Verifica que FormCustomer se haya renderizado
    expect(screen.getByTestId('form-customer')).toBeInTheDocument();
  });
});
