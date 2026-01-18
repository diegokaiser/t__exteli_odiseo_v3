import ReportPage from '@/app/(dashboard)/clockify/report/page';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('@/auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: { $id: 'user123' } }),
}));
jest.mock('@/hooks/useClockify', () => ({
  useGetRecordsByPeriod: () => ({
    data: [{ id: '2026-01-12', records: [] }],
    isLoading: false,
    isError: false,
  }),
}));
jest.mock('@/hooks/useUsers', () => ({
  useUserName: () => ({
    data: { fullName: 'Juan Pérez' },
  }),
}));

jest.mock('@react-pdf/renderer', () => ({
  PDFViewer: ({ children }: any) => <div data-testid="pdf-viewer">{children}</div>,
}));
jest.mock('@/components/wrappers', () => ({
  Report: () => <div data-testid="report">Reporte</div>,
}));
jest.mock('@/components/organisms', () => ({
  Breadcrumbs: ({ pageTitle }: { pageTitle: string }) => (
    <div data-testid="breadcrumbs">{pageTitle}</div>
  ),
}));

describe('ReportPage visual test', () => {
  it('renders the report page with calendar and report viewer', () => {
    render(<ReportPage />);

    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Generar reporte');
    expect(screen.getByLabelText('Seleccionar rango de fechas')).toBeInTheDocument();
    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('report')).toBeInTheDocument();
  });
});
