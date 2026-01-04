import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import CardCustomer from '@/components/organisms/CardCustomer/CardCustomer';
import { useCustomer } from '@/hooks/useCustomer';

jest.mock('@/hooks/useCustomer');

describe('CardCustomer', () => {
  const mockedUseCustomer = useCustomer as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el nombre, imagen y estado cuando hay datos', () => {
    mockedUseCustomer.mockReturnValue({
      data: {
        firstName: 'Sandalio',
        lastName: 'Meltronco Choro',
        fullName: 'Sandalio Meltronco Choro',
        gender: 'Masculino',
        status: 'Activo',
      },
      isLoading: false,
      isError: false,
    });

    render(<CardCustomer customerId="1" />);
    expect(screen.getByText('Sandalio Meltronco Choro')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Sandalio');
    expect(img).toHaveAttribute('src');
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('debe renderizar in Tag si no hay status', () => {
    mockedUseCustomer.mockReturnValue({
      data: {
        firstName: 'Sandalio',
        lastName: 'Meltronco Choro',
        fullName: 'Sandalio Meltronco Choro',
        gender: 'Masculino',
        status: undefined,
      },
      isLoading: false,
      isError: false,
    });

    render(<CardCustomer customerId="1" />);
    expect(screen.getByText('Sandalio Meltronco Choro')).toBeInTheDocument();
    const tag = screen.queryByText('Activo');
    expect(tag).not.toBeInTheDocument();
  });
});
