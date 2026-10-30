# STREETWEAR. — Production-Readiness Implementation Plan

> **Status**: In progress — Phase 5 production-readiness improvements  
> **Last updated**: 2026-10-30

---

## 1. Audit Findings

### 1.1 Architecture Overview

The storefront is a React 19 + TypeScript + Vite + Tailwind CSS SPA with:

- **Service layer abstraction**: All data access goes through typed contracts in `src/services/contracts/`, backed by in-memory mock adapters in `src/services/mock/`.
- **No real Firebase or Razorpay integration**: The mock layer simulates latency and returns deterministic data seeded from `src/data/catalog.ts`.
- **Admin console** at `/admin` with full CRUD for products, categories, inventory, orders, customers, and promotions.
- **Clean architecture**: Components never touch raw arrays or `localStorage` directly.

### 1.2 Gaps Identified

| Area | Finding | Risk |
|---|---|---|
| `Collection` type | Missing `productIds`, `status`, `sortOrder`, `createdAt`, `updatedAt` | Medium — cannot filter by status in Firestore |
| Admin service contract | No collection management methods | Medium — admin console incomplete |
| Payment | No Razorpay integration; only demo mode | High — blocks live commerce |
| Firebase config | No `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `storage.rules` | High — deployment blocked |
| Cloud Functions | No `functions/` directory | High — server-side payment logic missing |
| Typography | `.display-hero` class missing | Low — editorial quality |
| Tests | No collection or payment tests | Medium — regression risk |

---

## 2. Implementation Stages

### Stage 1 — Type System Extension (Tasks 2–3)
- Extend `Collection` type with `productIds`, `sortOrder`, `status`, `createdAt`, `updatedAt`, `publishedAt`, `unpublishedAt`, `story`, `additionalImages`
- Add `PaymentStatus` union (extended with real payment states)
- Add `RazorpayOrderResponse` and `RazorpayPaymentResult` interfaces
- Add `AdminCollectionInput` to admin contract
- Extend `AdminService` with collection CRUD methods

### Stage 2 — Mock Data & DB (Tasks 4–5)
- Patch existing seed collections with new required fields (`productIds`, `sortOrder`, `status`, `createdAt`, `updatedAt`)
- Implement admin service collection methods with slug uniqueness validation
- Update `catalogService.listCollections()` and `getCollection()` to filter by `status === 'published'`

### Stage 3 — UI & Routing (Tasks 6–8, 10)
- Add `adminCollections` and `adminCollection` query keys
- Create `AdminCollectionsPage.tsx` with full CRUD UI
- Add route and nav link
- Update `CollectionCard.tsx` for graceful backward compat

### Stage 4 — Payment Integration (Task 11)
- Update `.env.example` with Razorpay public key variable
- Create `functions/package.json`, `functions/tsconfig.json`
- Create `functions/src/index.ts` with `createRazorpayOrder`, `verifyRazorpayPayment`, `razorpayWebhook`
- Create `functions/src/types.ts`
- Create `src/hooks/useRazorpayCheckout.ts`
- Update `CheckoutPage.tsx` to support both demo and Razorpay modes

### Stage 5 — Firebase Config (Task 12)
- `firebase.json` — project config with emulators
- `firestore.rules` — expanded to cover `collections` collection
- `firestore.indexes.json` — compound indexes for queries
- `storage.rules` — bucket access rules

### Stage 6 — DX & Quality (Tasks 13–15)
- Fluid typography in `index.css` and `tailwind.config.js`
- Collection and Razorpay unit tests
- Full README rewrite

---

## 3. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| TypeScript regressions from type extension | Low | Medium | `tsc -b` after every file change |
| Razorpay webhook secret exposure | Low | Critical | Never put secret in `VITE_` env vars; use Functions secret manager |
| Demo mode breakage after Collection status filter | Medium | High | All seeded collections set to `status: 'published'`; test in both modes |
| Slug collision during collection upsert | Low | Medium | Slug uniqueness check in mock admin service |
| Build failure due to missing import | Medium | High | `npx vite build` as final check |

---

## 4. Production Blockers

Before going live the following **must** be resolved by the team:

1. **Firebase project created** — `firebase login && firebase init` with real project ID
2. **Razorpay account** — obtain `rzp_live_*` key pair; store secret in Functions secret manager
3. **Admin custom claims** — set `token.admin === true` on admin UIDs via Firebase Admin SDK (cannot be set from client)
4. **Firestore indexes deployed** — `firebase deploy --only firestore:indexes`
5. **Functions deployed** — `cd functions && npm install && firebase deploy --only functions`
6. **Environment secrets** — `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` set via `firebase functions:secrets:set`
7. **CORS** — Cloud Functions CORS must be configured to allow your production domain
8. **Razorpay webhook endpoint** — register `https://<region>-<project>.cloudfunctions.net/razorpayWebhook` in Razorpay dashboard

---

## 5. Setup Instructions

### Local Development (Demo Mode — no credentials needed)

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run typecheck  # TypeScript strict check
npm run lint       # ESLint
npm test           # Vitest unit tests
npm run build      # Production build
```

### Firebase Emulator Setup

```bash
npm install -g firebase-tools
firebase login
firebase use <your-project-id>
firebase emulators:start
```

### Razorpay Sandbox Setup

1. Sign up at <https://razorpay.com>
2. In the Dashboard → Settings → API Keys → Generate Test Key
3. Add to `.env.local`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   VITE_COMMERCE_MODE=razorpay
   ```
4. Set server secrets in Firebase Functions:
   ```bash
   firebase functions:secrets:set RAZORPAY_KEY_SECRET
   firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
   ```

---

## 6. File Change Log

| File | Action | Notes |
|---|---|---|
| `src/types/index.ts` | Modified | Extended `Collection`, `PaymentStatus`; added Razorpay types |
| `src/services/contracts/admin.ts` | Modified | Added `AdminCollectionInput`, extended `AdminService` |
| `src/data/catalog.ts` | Modified | Added new fields to seed collections |
| `src/services/mock/admin.ts` | Modified | Implemented collection CRUD |
| `src/services/mock/catalog.ts` | Modified | Added status filter to public collection queries |
| `src/lib/queryKeys.ts` | Modified | Added `adminCollections`, `adminCollection` |
| `src/pages/admin/AdminCollectionsPage.tsx` | Created | Full collection management UI |
| `src/App.tsx` | Modified | Added collections route |
| `src/components/admin/AdminLayout.tsx` | Modified | Added Collections nav link |
| `src/components/collections/CollectionCard.tsx` | No change | Backward compatible with new type |
| `src/hooks/useRazorpayCheckout.ts` | Created | Dynamic script loader + modal |
| `src/pages/CheckoutPage.tsx` | Modified | Dual-mode demo + Razorpay checkout |
| `functions/package.json` | Created | Firebase Cloud Functions manifest |
| `functions/tsconfig.json` | Created | TypeScript config for Functions |
| `functions/src/index.ts` | Created | createRazorpayOrder, verifyRazorpayPayment, razorpayWebhook |
| `functions/src/types.ts` | Created | TypeScript interfaces for Functions |
| `firebase.json` | Created | Firebase project configuration |
| `firestore.rules` | Created | Firestore security rules |
| `firestore.indexes.json` | Created | Firestore composite indexes |
| `storage.rules` | Created | Firebase Storage rules |
| `.env.example` | Modified | Added Razorpay section |
| `src/styles/index.css` | Modified | Added fluid typography classes |
| `tailwind.config.js` | Modified | Added clamp() fontSize tokens |
| `src/services/mock/collections.test.ts` | Created | Collection CRUD unit tests |
| `src/services/mock/razorpay.test.ts` | Created | Payment validation unit tests |
| `README.md` | Rewritten | Full production documentation |
| `docs/IMPLEMENTATION_PLAN.md` | Created | This document |

