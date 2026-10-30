import type { Address } from '@/types';

export type AddressInput = Omit<Address, 'id' | 'customerId' | 'isDefault'> & {
  isDefault?: boolean;
};

export interface AddressBookService {
  list(customerId: string): Promise<Address[]>;
  create(customerId: string, input: AddressInput): Promise<Address>;
  update(customerId: string, addressId: string, input: AddressInput): Promise<Address>;
  remove(customerId: string, addressId: string): Promise<void>;
  setDefault(customerId: string, addressId: string): Promise<Address[]>;
}
