import type { Customer } from '@/types';

export interface DemoSession {
  customerId: string;
  email: string;
  signedInAt: string;
  demo: true;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CustomerAccountService {
  getSession(): DemoSession | null;
  getCustomer(customerId: string): Promise<Customer | null>;
  signIn(input: SignInInput): Promise<Customer>;
  register(input: RegisterInput): Promise<Customer>;
  signOut(): void;
  requestPasswordReset(email: string): Promise<{ message: string }>;
  updateProfile(
    customerId: string,
    patch: Partial<Pick<Customer, 'firstName' | 'lastName' | 'phone'>>,
  ): Promise<Customer>;
  listCustomers(): Promise<Customer[]>;
}
