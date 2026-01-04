import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import TimelineCustomer from '@/components/organisms/TimelineCustomer/TimelineCustomer';

// Mocks
jest.mock('@/hooks/useCustomer', () => ({
  useCustomer: jest.fn(),
}));

jest.mock('@/hooks/useTimeline', () => ({
  useTimeline: jest.fn(),
}));

import { useCustomer } from '@/hooks/useCustomer';
import { useTimeline } from '@/hooks/useTimeline';

describe('TimelineCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar los items de timeline cuando hay datos', () => {
    (useCustomer as jest.Mock).mockReturnValue({
      data: {
        timeline: 'timeline-1',
      },
      isLoading: false,
      isError: false,
    });

    (useTimeline as jest.Mock).mockReturnValue({
      data: [
        {
          createdAt: {
            toDate: () => new Date('2025-01-01T00:00:00Z'),
          },
          comment: 'Primer comentario',
          registerdBy: 'Usuario A',
        },
        {
          createdAt: {
            toDate: () => new Date('2025-01-05T00:00:00Z'),
          },
          comment: 'Segundo comentario',
          registerdBy: 'Usuario B',
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<TimelineCustomer customerId="1" />);

    expect(screen.getByText('Primer comentario')).toBeInTheDocument();
    expect(screen.getByText('Segundo comentario')).toBeInTheDocument();
    expect(screen.getByText('Usuario A')).toBeInTheDocument();
    expect(screen.getByText('Usuario B')).toBeInTheDocument();
  });

  it('no rompe si customer no tiene timeline', () => {
    (useCustomer as jest.Mock).mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
    });

    (useTimeline as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    render(<TimelineCustomer customerId="1" />);

    // No debe renderizar ningún contenido del timeline
    expect(screen.queryByText(/comentario/i)).not.toBeInTheDocument();
  });

  it('no renderiza el timeline mientras está cargando', () => {
    (useCustomer as jest.Mock).mockReturnValue({
      data: {
        timeline: 'timeline-1',
      },
      isLoading: false,
      isError: false,
    });

    (useTimeline as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<TimelineCustomer customerId="1" />);

    expect(screen.queryByText(/comentario/i)).not.toBeInTheDocument();
  });
});
