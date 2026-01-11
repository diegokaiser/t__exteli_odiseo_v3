import BillPage from '@/app/(dashboard)/billing/[id]/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';

jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useBills', () => ({
  useBill: () => ({
    data: {
      id: '123',
      number: 'F-001',
      billSerial: '2024',
      billNumber: '0000001',
      provider: {
        name: 'Proveedor S.A.',
        email: 'proveedor@example.com',
        document: '12345678A',
        documentType: 'CIF',
        address: 'Calle Ejemplo 123',
        city: 'Madrid',
        country: 'España',
        zipcode: '28001',
        agentUid: 'agent123',
        createdAt: { toDate: () => new Date() },
      },
      customer: 'Cliente Demo',
      phone: '600000000',
      createDate: '2024-01-10',
      description: [],
      subtotal: 100,
      descuentos: 0,
      ivas: [],
      irpfs: [],
      total: 121,
      notes: 'Ninguna',
      paymentMethod: 'Efectivo',
      status: 'pendiente',
    },
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: ({ pageTitle }: { pageTitle: string }) => (
    <div data-testid="breadcrumbs">{pageTitle}</div>
  ),
}));

jest.mock('@react-pdf/renderer', () => ({
  PDFViewer: ({ children }: any) => <div data-testid="pdf-viewer">{children}</div>,
}));

jest.mock('@/components/wrappers', () => ({
  Document: () => <div data-testid="document">Mock Document</div>,
}));

describe('BillPage', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
  });
  it('renderiza la factura', () => {
    render(<BillPage />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Factura N° F-001');
    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('document')).toHaveTextContent('Mock Document');
  });
});
