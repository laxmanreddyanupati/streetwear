/**
 * Service locator.
 *
 * Pages and components import services from here, never mock arrays or
 * localStorage. To migrate to Firebase, replace these implementations with
 * Firebase-backed classes that satisfy the same contracts.
 */
export { catalogService } from './mock/catalog';
export { cartService } from './mock/cart';
export { accountService, DEMO_EMAIL } from './mock/account';
export { addressBookService } from './mock/address';
export { checkoutService } from './mock/checkout';
export { orderService } from './mock/orders';
export { newsletterService } from './mock/newsletter';
export { adminService } from './mock/admin';
