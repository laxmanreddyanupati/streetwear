# Technical Audit & Architecture Specification: STREETWEAR.

## 1. Existing Project Audit (Phase One)

### 1.1 Original Architecture Overview
The legacy website (`legacy/index.html`, `legacy/product.html`, `legacy/style.css`, `legacy/product.css`, `legacy/script.js`, `legacy/product.js`) was a static multi-page prototype with inline DOM scripting.

| Domain | Legacy State | Issues & Limitations | Modern React Implementation |
| :--- | :--- | :--- | :--- |
| **Framework & Structure** | Raw HTML5 + Vanilla JS | Duplicated markup across `index.html` and `product.html`, manual DOM querying | React 19 + TypeScript (Strict) with component hierarchy & layout routes |
| **Styling & Design System** | Custom CSS files (`style.css`, `product.css`, `catalog.css`) | Inconsistent media queries, hardcoded layout values, limited responsive typography | Tailwind CSS with design tokens (`ink`, `paper`, `bone`, `acid`, `fraunces`, `inter`) |
| **Catalog & Products** | Hardcoded HTML articles | Static cards, hardcoded product IDs (`tee`, `jacket`), no category taxonomies | Structured catalog data (`src/data/catalog.ts`), type-safe models, dynamic filtering |
| **Variant Selection** | Hardcoded data attributes on `product.html` | Only one single product was viewable; variants did not link to inventory | Dynamic size/color matrix, stock checking per variant, disabled out-of-stock states |
| **Shopping Cart** | `localStorage` Map in `script.js` | Direct client-side mutation, no server-side price validation, no subtotal tax/shipping breakdown | `CartContext` with `CartService` contract, atomic mutations, line validation |
| **Checkout Flow** | Fake alert message in `script.js` | Did not collect customer address, contact info, or validate inputs | Full multi-step checkout with React Hook Form + Zod, demo order creation & confirmation |
| **Customer Accounts** | Non-existent | No order history, address book, profile, or login flows | Full authentication shell, customer profile, address management, and order history |
| **Admin Controls** | Non-existent | No way to inspect orders or change inventory levels | Dedicated Admin Console (Metrics, Products, Inventory, Categories, Orders, Promos) |

### 1.2 Preserved Assets & Visual Identity
- **Brand Identity**: Kept `STREETWEAR.` with trademark dot accent and tagline *"Built for the streets. Less ordinary. More you."*
- **Hero & Campaign Photography**: Reused all high-resolution editorial assets (`public/images/`) with responsive art direction and zero distorted aspect ratios.
- **Original Catalog Pieces**: Re-anchored the initial drop items (*Essential Boxy Tee*, *Urban Layer Jacket*, *Everyday Street Fit*, *Daily Rotation*) into rich domain models with real fabric GSM, compositions, and colorways.

---

## 2. Storefront Architecture (Phase Two & Three)

### 2.1 Route Architecture (`src/App.tsx`)
```
/                          -> HomePage (Hero, New Arrivals, Best Sellers, Brand Story, Newsletter)
/shop                      -> ShopPage (Faceted product grid, category, size, price, sort)
/collections               -> CollectionsPage (Lookbooks & curated releases)
/collections/:slug         -> CollectionDetailPage (Curated collection items)
/product/:slug             -> ProductPage (Gallery, size guide, variant picker, details)
/cart                      -> CartPage (Full bag management, subtotal, shipping tracker)
/checkout                  -> CheckoutPage (Address form, shipping selector, promo codes)
/checkout/success/:orderId -> OrderConfirmationPage (Order receipt & tracking)
/about                     -> AboutPage (Studio history, atelier principles, sustainability)
/contact                   -> ContactPage (Dispatch form, studio concierge coordinates)
/faq                       -> FaqPage (Interactive categorized accordion)
/shipping                  -> PolicyPage (Shipping & delivery terms)
/returns                   -> PolicyPage (14-day exchange & return policy)
/privacy                   -> PolicyPage (Data stewardship & privacy notice)
/terms                     -> PolicyPage (Storefront terms & conditions)

/account/login             -> LoginPage (Demo credentials or custom login)
/account/register          -> RegisterPage (Client registration)
/account/forgot-password   -> ForgotPasswordPage
/account                   -> AccountLayout (Protected route)
  ├── /                    -> AccountProfilePage (Personal info & security)
  ├── /orders              -> AccountOrdersPage (Order history list)
  ├── /orders/:orderId     -> AccountOrderDetailPage (Live tracking & item details)
  └── /addresses           -> AccountAddressesPage (Saved address book)

/admin                     -> AdminLayout (Gated route)
  ├── /                    -> AdminDashboardPage (KPIs, revenue, orders by status, stock alerts)
  ├── /products            -> AdminProductsPage (Add/edit garments, price, metadata)
  ├── /inventory           -> AdminInventoryPage (Live stock modifier per SKU)
  ├── /categories          -> AdminCategoriesPage (Manage taxonomy)
  ├── /orders              -> AdminOrdersPage (Inspect & update order pipeline)
  ├── /customers           -> AdminCustomersPage (Registered customer index)
  └── /promotions          -> AdminPromotionsPage (Create/toggle discount codes)
```

### 2.2 Service Layer Pattern
All components communicate exclusively through service contracts defined in `src/services/contracts/`:
- `ICatalogService`: Products, categories, search, facets, collections.
- `ICartService`: Resolving lines against inventory, clamping to stock, calculating totals.
- `ICheckoutService`: Validating promotions, generating quotes, placing demo orders.
- `IOrderService`: Retrieving customer orders, generating sequential order numbers.
- `IAddressBookService`: CRUD for saved shipping destinations.
- `IAdminService`: Studio KPIs, stock management, status updates.

This ensures zero page components touch `localStorage` directly, allowing a plug-and-play migration to Firebase Cloud Firestore and Authentication in Phase Four.
