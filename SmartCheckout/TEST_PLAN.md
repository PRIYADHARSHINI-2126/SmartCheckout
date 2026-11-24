# Checkout Test Plan & Execution Results

## 1. Scope & Prioritized Risks

This test plan covers the single-page checkout journey for **Alder & Clay** (`/`). Risks are ranked by customer and revenue impact:

| Priority | Risk Area | Why It Matters | Verification Approach |
| :--- | :--- | :--- | :--- |
| **P0 (Critical)** | **Duplicate Order Confirmation** | Rapid double-clicks on `Place Order` before state settles could generate multiple confirmations or references. | Manual rapid `dblclick` + synchronous dual-click dispatch test. |
| **P0 (Critical)** | **Incorrect Line / Order Totals** | Floating-point drift or stale cart state could charge or display the wrong `₹` amount after quantity edits. | Automated Playwright Check 3 + direct numeric input check. |
| **P1 (High)** | **Checkout Allowed with Missing Required Field** | Submitting with blank or whitespace-only `Full Name` could confirm an unidentifiable order or wipe cart state. | Automated Playwright Check 2 + manual whitespace check. |
| **P1 (High)** | **Checkout Allowed with Empty Cart** | Submitting with 0 items could create a `₹0.00` order or clear the customer's entered name. | Manual empty-cart test with pre-filled `Full Name`. |
| **P2 (Medium)** | **State Leakage / Broken Layout** | Unclean state between sessions, missing images, or mobile overflow could degrade usability. | Clean-state `beforeEach` in Playwright + 1440px/390px layout & console audit. |

---

## 2. Automated Browser Test Results

**Command:** `npm run test:e2e`  
**Browser:** Headless Chromium (`@playwright/test` 1.65.1)

| Check | Scenario | Key Assertions | Result |
| :--- | :--- | :--- | :--- |
| **Check 1** | Successful checkout produces confirmation | Cart count `(1)`, line total `₹600.00`, `Full Name` = `"Maya Lin"`, single `order-confirmation` visible, reference matches `/^AC-\d{6}$/`, confirmed total `₹600.00`, button disabled (`Order Placed`). | **PASS** |
| **Check 2** | Missing required field blocks checkout | Cart contains `Fluted Ceramic Dripper` (`₹300.00`), `Full Name` blank, `role="alert"` shows `"Full Name is required to complete your order."`, `order-confirmation` count is `0`, cart item & `₹300.00` total preserved. | **PASS** |
| **Check 3** | Quantity changes update exact totals | Kettle `1 -> 2` (`₹600.00 -> ₹1,200.00`), Dripper `0 -> 3` (`₹900.00`, combined `₹2,100.00`, count `(5)`), Kettle `2 -> 1` (`₹600.00`, combined `₹1,500.00`, count `(4)`). | **PASS** |

---

## 3. Manual Exploratory Test Records

Executed in headless Chromium against the running app (`http://127.0.0.1:3000`):

### Manual Test A — Empty Cart Submission (with Pre-Filled Name)
- **Steps**:
  1. Load `/` from a clean state (cart empty, `Order Total` = `₹0.00`).
  2. Type `Alex Rivera` into `Full Name`.
  3. Click `Place Order`.
- **Expected Result**: Checkout is blocked; a clear validation message explains the cart is empty; no confirmation is created; `Alex Rivera` remains in the `Full Name` input.
- **Actual Result**: Validation alert rendered `"Checkout cannot be completed — Your cart is empty. Add at least one item before placing an order."`; `order-confirmation` count remained `0`; `Full Name` input still contained `"Alex Rivera"`.
- **Status**: **PASS**

### Manual Test B — Rapid Double-Click on Place Order
- **Steps**:
  1. Load `/` from a clean state.
  2. Add `Gooseneck Pour-Over Kettle` (`₹600.00`) to cart and enter `Jordan Patel` in `Full Name`.
  3. Perform a rapid double-click (`dblclick`) on `Place Order`.
- **Expected Result**: Strictly one `Order Confirmed` panel and one order reference are produced; repeat clicks do not produce a second confirmation.
- **Actual Result**: Strictly `1` confirmation rendered (`AC-XXXXXX`), confirmed total `₹600.00`, and `Place Order` transitioned to disabled `"Order Placed"`.
- **Status**: **PASS**

### Manual Test C — Console, Media, and Responsive Layout Check
- **Viewports**: `1440×900` (desktop) and `390×844` (mobile)
- **Observed Result**: `0` console errors, `0` uncaught page errors, both original studio product images loaded (`complete: true`, `naturalWidth: 1200`), and `scrollWidth === innerWidth` with no horizontal overflow.
- **Status**: **PASS**

---

## 4. Defect Log

No defects were observed across the automated or manual test runs.
