import ClockifyPage from '@/app/(dashboard)/clockify/page';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/hocs/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

jest.mock('@/components/organisms', () => ({
  Breadcrumbs: ({ pageTitle }: { pageTitle: string }) => (
    <div data-testid="breadcrumbs">{pageTitle}</div>
  ),
  ClockifyCalendar: () => <div data-testid="clockify-calendar">Calendar</div>,
}));

describe('ClockifyPage visual test', () => {
  it('renders the Clockify page with calendar and breadcrumbs', () => {
    render(<ClockifyPage />);

    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent(/Historial de tiempo/i);

    expect(screen.getByTestId('clockify-calendar')).toBeInTheDocument();
  });
});
