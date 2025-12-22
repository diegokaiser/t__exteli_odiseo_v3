import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Login } from "@/app/components/organisms";
import { AuthProvider } from "@/app/features/auth/context/AuthProvider";

jest.mock('@/app/lib/appwrite', () => ({
  account: {
    createEmailPasswordSession: jest.fn(),
    deleteSession: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));


describe('Login, validación de inputs', () => {
  const renderComponent = () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  };

  it('Muestra error si el email no tiene formato válido', async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    fireEvent.change(emailInput, { target: { value: 'diegokaiser' } });

    const passwordInput = screen.getByPlaceholderText('********');
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    const submitButton = screen.getByLabelText('Login');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Por favor, ingresa un correo electrónico válido')).toBeInTheDocument();
  });

  it('Deshabilita el botón si el formulario es inválido', async () => {
    renderComponent();
    
    const submitButton = screen.getByLabelText('Login');

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    fireEvent.change(emailInput, { target: { value: 'diegokaiser' } });

    const passwordInput = screen.getByPlaceholderText('********');
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
