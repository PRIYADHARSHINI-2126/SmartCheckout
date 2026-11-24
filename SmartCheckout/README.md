# Alder & Clay — Single-Page Checkout & Browser Test Suite

A single-page storefront checkout built with React, TypeScript, Tailwind CSS, and an automated Playwright Chromium test suite.

## Features

- **Fixed-Price Catalog**: Two synthetic studio products priced in Indian Rupees (`₹`) using integer-paise arithmetic (`Gooseneck Pour-Over Kettle` at `₹600.00` and `Fluted Ceramic Dripper` at `₹300.00`).
- **Live Cart & Totals**: Add or remove items, adjust quantities via steppers or direct numeric entry, and inspect exact line totals and order total updates.
- **Validation & Input Preservation**: Blocks checkout when the cart is empty or `Full Name` is blank/whitespace, displays clear `role="alert"` messages, and preserves entered customer input.
- **Idempotent Confirmation**: Prevents duplicate confirmations on rapid double-click via both synchronous ref locking and disabled post-submission state, issuing a single order reference (`AC-XXXXXX`).

## Running the Application

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server** (runs on port `3000`)

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` in your browser.

3. **Type-check and build for production**

   ```bash
   npm run lint
   npm run build
   ```

## Running the Automated Browser Tests

The Playwright suite (`tests/checkout.spec.ts`) starts from a clean state (`beforeEach` reloads `/` and verifies an empty cart at `₹0.00`) and uses customer-visible assertions without fixed sleeps.

1. **Ensure Chromium is available** (if running on a fresh machine outside the pre-provisioned environment):

   ```bash
   npx playwright install chromium
   ```

2. **Execute the 3 automated checks**:

   ```bash
   npm run test:e2e
   ```

   What the suite verifies:
   - **Check 1**: Adding an item (`₹600.00`), entering a valid `Full Name`, and clicking `Place Order` displays a single `Order Confirmed` receipt with an `AC-XXXXXX` reference and disables repeat submission (`Order Placed`).
   - **Check 2**: Attempting checkout with a non-empty cart (`₹300.00`) and a blank `Full Name` blocks order placement, renders the validation alert, and preserves the cart and total.
   - **Check 3**: Incrementing and decrementing quantities across both products updates each item's line total, the header cart count, and the exact order total (`₹600.00 -> ₹1,200.00 -> ₹2,100.00 -> ₹1,500.00`).

## Test Plan & Results

See [`TEST_PLAN.md`](./TEST_PLAN.md) for the risk-prioritized test plan, manual test records (empty cart and rapid double-click), and observed execution results.
