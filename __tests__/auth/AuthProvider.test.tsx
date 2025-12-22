import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "@/auth/context/AuthProvider";
import { useAuth } from "@/auth/hooks/useAuth";
import { account } from "@/lib/appwrite"

jest.mock('@/app/lib/appwrite', () => ({
  account: {
    createEmailPasswordSession: jest.fn(),
    deleteSession: jest.fn(),
    get: jest.fn(),
  },
}));

describe('AuthProvider', () => {
  it('logea al usuario correctamente', async () => {
    (account.createEmailPasswordSession as jest.Mock).mockResolvedValue({});
    (account.get as jest.Mock).mockResolvedValue({
      name: 'Diego Cáceres Cardoza',
      email: 'diegokaiser@gmail.com',
    });
    
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });    

    await act(async () => {
      await result.current.login('diegokaiser@gmail.com', '123456', false);
    })

    expect(result.current.user?.name).toBe('Diego Cáceres Cardoza');
  });

  it('desogea al usuario correctamente', async () => {
    (account.get as jest.Mock).mockResolvedValueOnce({
      name: 'Diego Cáceres Cardoza',
      email: 'diegokaiser@gmail.com',
    });

    (account.deleteSession as jest.Mock).mockResolvedValue({});

    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('logout@test.com', 'password', false);
    });

    expect(result.current.user).not.toBeNull();

    await act(async () => {
      await result.current.logout();
    });

    expect(account.deleteSession).toHaveBeenCalledWith('current');
    expect(result.current.user).toBeNull();
  });
});
