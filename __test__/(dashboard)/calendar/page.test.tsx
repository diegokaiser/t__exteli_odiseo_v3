import CalendarPage from '@/app/(dashboard)/calendar/page';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('@/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { $id: 'user-123' },
  }),
}));

jest.mock('@/hooks/useUsers', () => ({
  useUsers: () => ({
    data: [
      { id: 'user-123', firstName: 'Ana', lastName: 'García' },
      { id: 'user-456', firstName: 'Luis', lastName: 'Martínez' },
    ],
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: ({ pageTitle }: { pageTitle: string }) => (
    <div data-testid="breadcrumbs">{pageTitle}</div>
  ),
  Calendar: ({ userUid }: { userUid: string }) => (
    <div data-testid="calendar-component">Calendar for {userUid}</div>
  ),
}));

jest.mock('@/components/atoms', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

describe('CalendarPage visual test', () => {
  it('renders the Calendar page with breadcrumb, dropdown and calendar', () => {
    render(<CalendarPage />);

    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent(/Agenda/i);
    expect(screen.getByLabelText(/Seleccionar agente/i)).toBeInTheDocument();
    expect(screen.getByTestId('calendar-component')).toHaveTextContent('Calendar for user-123');
    expect(screen.getByRole('button', { name: /Agregar cita/i })).toBeInTheDocument();
  });
});
