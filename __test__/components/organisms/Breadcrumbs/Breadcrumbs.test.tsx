import Breadcrumbs from '@/components/organisms/Breadcrumbs/Breadcrumbs';
import { render, screen } from '@testing-library/react';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock de next/link para simplificar el DOM
jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

import { usePathname } from 'next/navigation';

describe('Breadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar Home solo cuando no hay más segmentos', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Breadcrumbs labels={{}} pageTitle="Página Principal" />);

    // Home siempre debe existir
    expect(screen.getByText('Home')).toBeInTheDocument();

    // No debe renderizar slashes adicionales
    const dividers = screen.queryAllByText('/');
    expect(dividers.length).toBe(0);

    // pageTitle debe mostrarse
    expect(screen.getByText('Página Principal')).toBeInTheDocument();
  });

  it('debe renderizar múltiples segmentos de ruta', () => {
    (usePathname as jest.Mock).mockReturnValue('/clientes/123/perfil');

    render(
      <Breadcrumbs
        labels={{ clientes: 'Clientes', perfil: 'Perfil' }}
        pageTitle="Perfil de Cliente"
      />
    );

    // Home + Clientes + 123 + Perfil
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();

    // Slashes (/) entre elementos
    const slashElements = screen.getAllByText('/');
    expect(slashElements.length).toBe(3);

    // pageTitle debe mostrarse
    expect(screen.getByText('Perfil de Cliente')).toBeInTheDocument();
  });

  it('usa decodeURIComponent si no hay etiqueta para segmento', () => {
    (usePathname as jest.Mock).mockReturnValue('/ruta%20con%20espacios');

    render(
      <Breadcrumbs
        labels={{}} // no hay traducción para este segmento
        pageTitle="Título"
      />
    );

    expect(screen.getByText('ruta con espacios')).toBeInTheDocument();
  });

  it('no renderiza pageTitle si no se pasa', () => {
    (usePathname as jest.Mock).mockReturnValue('/solo/ruta');

    render(<Breadcrumbs labels={{ solo: 'Solo', ruta: 'Ruta' }} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('genera URLs correctas para cada breadcrumb', () => {
    (usePathname as jest.Mock).mockReturnValue('/a/b/c');

    render(<Breadcrumbs labels={{ a: 'A', b: 'B', c: 'C' }} />);

    // Los href deben acumular el path correctamente
    expect(screen.getByText('A').closest('a')).toHaveAttribute('href', '/a');
    expect(screen.getByText('B').closest('a')).toHaveAttribute('href', '/a/b');
    expect(screen.getByText('C').closest('a')).toBeNull();
  });
});
