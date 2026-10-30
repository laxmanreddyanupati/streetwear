import type { Customer } from '@/types';
import type {
  CustomerAccountService,
  DemoSession,
  RegisterInput,
  SignInInput,
} from '@/services/contracts/account';
import { db, simulateLatency } from './db';
import { createId, readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';

type StoredProfiles = Customer[];

function loadProfiles(): Customer[] {
  const stored = readStorage<StoredProfiles>(STORAGE_KEYS.demoProfiles, []);
  const safe = Array.isArray(stored)
    ? stored.filter(
        (profile): profile is Customer =>
          Boolean(profile) &&
          typeof profile.id === 'string' &&
          typeof profile.email === 'string' &&
          profile.demo === true,
      )
    : [];
  const merged = [...db.customers];
  safe.forEach((profile) => {
    const index = merged.findIndex((customer) => customer.email === profile.email);
    if (index >= 0) merged[index] = profile;
    else merged.push(profile);
  });
  return merged;
}

function saveProfiles(profiles: Customer[]) {
  const localOnly = profiles.filter((profile) => !db.customers.some((item) => item.email === profile.email));
  writeStorage(STORAGE_KEYS.demoProfiles, localOnly);
}

function setSession(customer: Customer) {
  const session: DemoSession = {
    customerId: customer.id,
    email: customer.email,
    signedInAt: new Date().toISOString(),
    demo: true,
  };
  writeStorage(STORAGE_KEYS.demoSession, session);
}

function personFromEmail(email: string): Pick<Customer, 'firstName' | 'lastName'> {
  const local = email.split('@')[0] ?? 'Guest';
  const parts = local.replace(/[._-]+/g, ' ').trim().split(/\s+/);
  return {
    firstName: parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Guest',
    lastName: parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'Customer',
  };
}

export const accountService: CustomerAccountService = {
  getSession() {
    const session = readStorage<DemoSession | null>(STORAGE_KEYS.demoSession, null);
    if (!session || session.demo !== true || typeof session.email !== 'string') return null;
    return session;
  },

  async getCustomer(customerId) {
    await simulateLatency(60);
    return loadProfiles().find((customer) => customer.id === customerId) ?? null;
  },

  async signIn(input: SignInInput) {
    await simulateLatency(220);
    const email = input.email.trim().toLowerCase();
    if (input.password.length < 8) {
      throw new Error('Demo passwords must be at least 8 characters. No password is stored.');
    }
    const profiles = loadProfiles();
    let customer = profiles.find((item) => item.email.toLowerCase() === email);
    if (!customer) {
      const person = personFromEmail(email);
      customer = {
        id: createId('cus'),
        email,
        firstName: person.firstName,
        lastName: person.lastName,
        createdAt: new Date().toISOString(),
        demo: true,
      };
      profiles.push(customer);
      saveProfiles(profiles);
    }
    setSession(customer);
    return customer;
  },

  async register(input: RegisterInput) {
    await simulateLatency(220);
    const email = input.email.trim().toLowerCase();
    if (input.password.length < 8) {
      throw new Error('Choose a password of at least 8 characters.');
    }
    const profiles = loadProfiles();
    if (profiles.some((item) => item.email.toLowerCase() === email)) {
      throw new Error('An account with this email already exists. Sign in instead.');
    }
    const customer: Customer = {
      id: createId('cus'),
      email,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      createdAt: new Date().toISOString(),
      demo: true,
    };
    profiles.push(customer);
    saveProfiles(profiles);
    setSession(customer);
    return customer;
  },

  signOut() {
    writeStorage(STORAGE_KEYS.demoSession, null);
  },

  async requestPasswordReset(email) {
    await simulateLatency(200);
    return {
      message: `Demo mode: no reset email was sent. In production, a secure reset link would be sent to ${email}.`,
    };
  },

  async updateProfile(customerId, patch) {
    await simulateLatency(140);
    const profiles = loadProfiles();
    const index = profiles.findIndex((customer) => customer.id === customerId);
    if (index < 0) throw new Error('Customer not found.');
    const updated: Customer = { ...profiles[index]!, ...patch };
    profiles[index] = updated;
    saveProfiles(profiles);
    setSession(updated);
    return updated;
  },

  async listCustomers() {
    await simulateLatency(80);
    return loadProfiles();
  },
};

export const DEMO_EMAIL = 'demo@streetwear.studio';
