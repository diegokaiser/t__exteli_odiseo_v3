import CustomerPage from '@/app/(dashboard)/customers/[id]/page';
import { useCustomerName } from '@/hooks/useCustomer';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';

jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('@/hooks/useCustomer', () => ({
  useCustomerName: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: (props: any) => <div data-testid="breadcrumbs">{props.pageTitle}</div>,
  CardCustomer: (props: any) => <div data-testid="card-customer">{props.customerId}</div>,
  TimelineCustomer: (props: any) => (
    <div data-testid="timeline-customer">Timeline: {props.customerId}</div>
  ),
  DataCustomer: (props: any) => <div data-testid="data-customer">Data: {props.customerId}</div>,
}));

jest.mock('@/components/skeletons/organisms', () => ({
  SkeletonCardCustomer: () => <div data-testid="skeleton-card-customer" />,
  SkeletonDataCustomer: () => <div data-testid="skeleton-data-customer" />,
  SkeletonTimeline: () => <div data-testid="skeleton-timeline" />,
}));

describe('CustomerPage', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: 'abc123' });
    (useCustomerName as jest.Mock).mockReturnValue({
      data: 'Sandalio',
      isLoading: false,
      isError: false,
    });
  });

  it('debe renderizar Breadcrumbs y componentes del cliente con el ID correcto', () => {
    render(<CustomerPage />);
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Sandalio');
    expect(screen.getByTestId('card-customer')).toHaveTextContent('abc123');
    expect(screen.getByTestId('timeline-customer')).toHaveTextContent('Timeline: abc123');
    expect(screen.getByTestId('data-customer')).toHaveTextContent('Data: abc123');
  });
});
