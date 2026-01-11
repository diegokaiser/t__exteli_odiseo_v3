import CompanyPage from '@/app/(dashboard)/settings/company/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
  CompanyLogo: () => <div data-testid="company-logo" />,
  CompanyData: () => <div data-testid="company-data" />,
}));

jest.mock('@/components/skeletons/organisms', () => ({
  SkeletonCompanyLogo: () => <div data-testid="skeleton-company-logo" />,
  SkeletonCompanyData: () => <div data-testid="skeleton-company-data" />,
}));

describe('CompanySettingsPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el layout con placeholders para el logo y data', () => {
    render(<CompanyPage />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('company-logo')).toBeInTheDocument();
    expect(screen.getByTestId('company-data')).toBeInTheDocument();
  });
});
