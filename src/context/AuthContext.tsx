import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Customer } from '@/types';
import { accountService } from '@/services';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  customer: Customer | null;
  status: AuthStatus;
  signIn: (input: { email: string; password: string }) => Promise<Customer>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<Customer>;
  signOut: () => void;
  updateProfile: (
    patch: Partial<Pick<Customer, 'firstName' | 'lastName' | 'phone'>>,
  ) => Promise<Customer>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    accountService.getSession() ? 'loading' : 'anonymous',
  );

  useEffect(() => {
    const session = accountService.getSession();
    if (!session) return;
    let cancelled = false;
    accountService
      .getCustomer(session.customerId)
      .then((profile) => {
        if (cancelled) return;
        if (profile) {
          setCustomer(profile);
          setStatus('authenticated');
        } else {
          accountService.signOut();
          setStatus('anonymous');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('anonymous');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (input: { email: string; password: string }) => {
    const profile = await accountService.signIn(input);
    setCustomer(profile);
    setStatus('authenticated');
    return profile;
  }, []);

  const register = useCallback(
    async (input: { firstName: string; lastName: string; email: string; password: string }) => {
      const profile = await accountService.register(input);
      setCustomer(profile);
      setStatus('authenticated');
      return profile;
    },
    [],
  );

  const signOut = useCallback(() => {
    accountService.signOut();
    setCustomer(null);
    setStatus('anonymous');
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<Customer, 'firstName' | 'lastName' | 'phone'>>) => {
      if (!customer) throw new Error('Sign in to update your profile.');
      const updated = await accountService.updateProfile(customer.id, patch);
      setCustomer(updated);
      return updated;
    },
    [customer],
  );

  const value = useMemo(
    () => ({ customer, status, signIn, register, signOut, updateProfile }),
    [customer, status, signIn, register, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
