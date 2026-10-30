# STREETWEAR. — Premium Contemporary Clothing Brand Storefront

A high-performance, editorial fashion e-commerce storefront transformed from a legacy static prototype into a contemporary web application built with **React 19**, **TypeScript (Strict Mode)**, **Vite**, and **Tailwind CSS**.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v20+)
- npm or pnpm

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev
```

The application will launch locally at:
👉 **`http://127.0.0.1:5173`**

---

## 2. Quality & Verification Commands

All checks pass with zero errors:

```bash
# Type check (TypeScript Strict Mode)
npm run typecheck

# Lint check (ESLint with React Hooks & TypeScript rules)
npm run lint

# Unit test suite (Vitest + Testing Library)
npm test

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## 3. Technology Stack

- **Framework**: React 19 + TypeScript (Strict Mode)
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom editorial tokens (`ink`, `paper`, `bone`, `acid`, `fraunces`, `inter`)
- **Routing**: React Router v7
- **Data Management**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React + custom inline editorial SVGs
- **Headless Components**: Radix UI (Dialog, Dropdown, Accordion, Select)
- **Testing**: Vitest, React Testing Library, Playwright (configured for e2e)

---

## 4. Key Storefront Features & Walkthrough

### Customer Storefront
- **Home Page (`/`)**: High-fashion editorial hero with campaign typography, announcement bar, New Arrivals grid, Best Sellers, Curated Collections, Atelier Story, and validated newsletter dispatch.
- **Shop & Faceted Filtering (`/shop`)**: Multi-attribute filtering (category, size, color, stock status, and price range), sorting (newest, popularity, price low/high), search with instant result counts, and loading skeletons.
- **Product Details (`/product/:slug`)**: Multi-image thumbnail gallery, dynamic size & color matrix with real-time stock inspection, interactive size guide modal, quantity stepper, and related pieces.
- **Slide-Over Bag & Cart (`/cart`)**: Persistent guest bag across browser reloads, atomic item adjustments, free shipping progress bar (threshold: ₹1,999), and promotion code validation.
- **Multi-Step Checkout (`/checkout`)**: Clean shipping address form with validation, carrier tier selection (Standard vs. Express), promo code discounts (`WELCOME10`), order notes, and demo order generation with instant order confirmation (`/checkout/success/:orderId`).
- **Client Account Hub (`/account`)**: Secure demo authentication (`/account/login`), order history with tracking stages (`/account/orders`), detailed receipt inspection (`/account/orders/:orderId`), and saved address book (`/account/addresses`).
- **Brand & Legal Polices**: Editorial About Page (`/about`), Concierge Contact Dispatch (`/contact`), Categorized FAQ Hub (`/faq`), Shipping Terms (`/shipping`), Returns Policy (`/returns`), Privacy Policy (`/privacy`), and Terms & Conditions (`/terms`).

### Studio Admin Console (`/admin`)
- **Dashboard Overview (`/admin`)**: Real-time atelier KPIs (gross revenue in INR, order volume, average order value, registered customers, low-stock alerts, and orders by fulfillment status).
- **Garment Listing (`/admin/products`)**: Add and edit pieces with fabric composition, cut notes, price in rupees, status toggles, and metadata.
- **Inventory Control (`/admin/inventory`)**: SKU-level stock adjustment with automatic low-stock badge thresholds.
- **Orders Pipeline (`/admin/orders`)**: Complete order tracking and fulfillment status transitions (`confirmed` → `processing` → `shipped` → `delivered`).
- **Campaign Promotions (`/admin/promotions`)**: Create, inspect, and toggle promotional discount codes.

---

## 5. Clean Architecture & Service Layer

Components never depend directly on mock arrays or `localStorage`. All data flows through domain contracts:

```
src/
  ├── app/                # App entry and top-level providers
  ├── components/
  │   ├── account/        # Profile layouts and auth wrappers
  │   ├── admin/          # Admin navigation layout and security gates
  │   ├── cart/           # Cart line items and slide-over drawer
  │   ├── common/         # Status badges, breadcrumbs, price formatters
  │   ├── forms/          # Type-safe input, select, and textarea fields
  │   ├── layout/         # Header, footer, announcement bar, mobile drawer
  │   ├── navigation/     # Mega menu, search suggestions, account dropdown
  │   ├── product/        # Product cards, purchase panel, size guide
  │   └── ui/             # Radix UI primitives & accessible components
  ├── data/               # Seeded catalog and drop collections
  ├── hooks/              # Custom TanStack Query hooks & page meta
  ├── pages/              # Routed pages (Storefront, Account, Admin)
  ├── schemas/            # Zod validation schemas
  ├── services/
  │   ├── contracts/      # Pure TypeScript interfaces (Catalog, Cart, Orders, Admin)
  │   └── mock/           # Mock service adapters (Replaced by Firebase in Phase 4)
  ├── types/              # Domain models (Product, Variant, Order, Address, etc.)
  └── utils/              # Integer minor currency formatters (INR) and helpers
```

---

## 6. Planned Firebase Integration (Phase 4)

Complete technical migration details and Cloud Firestore security rules are documented in:
👉 [`docs/FIREBASE_INTEGRATION_PLAN.md`](./docs/FIREBASE_INTEGRATION_PLAN.md)

- **Authentication**: Firebase Auth with custom claims (`token.admin === true`).
- **Cloud Firestore**: Strict Firestore rules preventing client-side order and pricing forgery.
- **Cloud Functions**: Trusted server-side order calculation, inventory decrement transactions, and payment provider webhook verification.
- **Environment Variables**: Documented in [`.env.example`](./.env.example).
