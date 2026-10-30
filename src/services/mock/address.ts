import type { Address } from '@/types';
import type { AddressBookService, AddressInput } from '@/services/contracts/address';
import { demoAddresses } from '@/data/catalog';
import { createId, readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';
import { simulateLatency } from './db';

type AddressStore = Record<string, Address[]>;

function loadStore(): AddressStore {
  const stored = readStorage<AddressStore>(STORAGE_KEYS.demoAddresses, {});
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  return stored;
}

function saveStore(store: AddressStore) {
  writeStorage(STORAGE_KEYS.demoAddresses, store);
}

function seedFor(customerId: string): Address[] {
  return demoAddresses.filter((address) => address.customerId === customerId);
}

export const addressBookService: AddressBookService = {
  async list(customerId) {
    await simulateLatency(80);
    const store = loadStore();
    if (store[customerId]) return store[customerId]!;
    const seeded = seedFor(customerId);
    if (seeded.length) {
      store[customerId] = seeded;
      saveStore(store);
    }
    return seeded;
  },

  async create(customerId, input: AddressInput) {
    await simulateLatency(130);
    const store = loadStore();
    const existing = store[customerId]?.length ? store[customerId]! : seedFor(customerId);
    const address: Address = {
      ...input,
      id: createId('adr'),
      customerId,
      isDefault: input.isDefault ?? existing.length === 0,
    };
    let next = [...existing, address];
    if (address.isDefault) {
      next = next.map((item) =>
        item.id === address.id ? item : { ...item, isDefault: false },
      );
    }
    store[customerId] = next;
    saveStore(store);
    return address;
  },

  async update(customerId, addressId, input: AddressInput) {
    await simulateLatency(130);
    const store = loadStore();
    const existing = store[customerId]?.length ? store[customerId]! : seedFor(customerId);
    const index = existing.findIndex((address) => address.id === addressId);
    if (index < 0) throw new Error('Address not found.');
    const updated: Address = { ...existing[index]!, ...input, id: addressId, customerId };
    let next = existing.map((address) => (address.id === addressId ? updated : address));
    if (updated.isDefault) {
      next = next.map((address) =>
        address.id === addressId ? address : { ...address, isDefault: false },
      );
    }
    store[customerId] = next;
    saveStore(store);
    return updated;
  },

  async remove(customerId, addressId) {
    await simulateLatency(100);
    const store = loadStore();
    const existing = store[customerId]?.length ? store[customerId]! : seedFor(customerId);
    const removed = existing.find((address) => address.id === addressId);
    let next = existing.filter((address) => address.id !== addressId);
    if (removed?.isDefault && next.length > 0) {
      next = next.map((address, index) => ({ ...address, isDefault: index === 0 }));
    }
    store[customerId] = next;
    saveStore(store);
  },

  async setDefault(customerId, addressId) {
    await simulateLatency(100);
    const store = loadStore();
    const existing = store[customerId]?.length ? store[customerId]! : seedFor(customerId);
    const next = existing.map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }));
    store[customerId] = next;
    saveStore(store);
    return next;
  },
};
