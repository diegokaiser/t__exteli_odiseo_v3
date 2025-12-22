import { render, screen, fireEvent, act } from '@testing-library/react';
import Nav from '@/app/components/organisms/Nav/Nav';
import { useAuth } from '@/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/app/features/auth/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Nav', () => {
  it('Muestra el nombre y correo del usuario', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'Diego Cáceres Cardoza', email: 'diegokaiser@gmail.com' },
      logout: jest.fn(),
      loading: false,
    });

    render(<Nav />);

    expect(screen.getByText('Diego Cáceres Cardoza')).toBeInTheDocument();
    expect(screen.getByText('diegokaiser@gmail.com')).toBeInTheDocument();
  });

  it('llama a logout y redirige al hacer click en el botón de logout', async () => {
    const logoutMock = jest.fn();
    const replaceMock = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'Usuario Test', email: 'test@correo.com' },
      logout: logoutMock,
      loading: false,
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
    });

    render(<Nav />);

    const logoutButton = screen.getAllByRole('button').pop()!;

    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(logoutMock).toHaveBeenCalled();
  });
});
