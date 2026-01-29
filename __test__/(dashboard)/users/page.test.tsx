import UsersPage from '@/app/(dashboard)/users/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/hooks/useUsers', () => ({
  useUsers: () => ({
    data: [
      {
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Administrador',
        phone: '123456789',
        status: 'Activo',
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('primereact/tag', () => ({
  Tag: ({ value }: { value: string }) => <div data-testid={`tag-${value}`}>{value}</div>,
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

jest.mock('@/components/atoms', () => ({
  LoadingScreen: () => <div data-testid="loading-screen">Loading</div>,
  Message: () => <div data-testid="error-message">Error</div>,
}));

describe('UsersPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente el listado de usuarios', () => {
    render(<UsersPage />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('tag-Administrador')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByTestId('tag-Activo')).toBeInTheDocument();
  });
});
