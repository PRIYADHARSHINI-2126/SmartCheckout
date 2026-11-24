import type { FormEvent } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../data/products';
import type {
  CartItem,
  CheckoutValidation,
  OrderConfirmation,
  Product,
} from '../types/checkout';
import { CartItemRow } from './CartItemRow';

interface CheckoutPanelProps {
  productsById: Record<string, Product>;
  cart: CartItem[];
  customerName: string;
  validation: CheckoutValidation;
  confirmation: OrderConfirmation | null;
  totalCents: number;
  onCustomerNameChange: (value: string) => void;
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (e: FormEvent<HTMLFormElement>) => void;
  onStartNewOrder: () => void;
}

export function CheckoutPanel({
  productsById,
  cart,
  customerName,
  validation,
  confirmation,
  totalCents,
  onCustomerNameChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onStartNewOrder,
}: CheckoutPanelProps) {
  const isConfirmed = confirmation !== null;
  const hasValidationErrors = Boolean(validation.cartError || validation.nameError);

  return (
    <section
      id="checkout"
      aria-labelledby="checkout-heading"
      className="rounded-xl border border-stone-200 bg-white p-6 md:p-8"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-stone-200 pb-4">
        <h2
          id="checkout-heading"
          className="font-display text-2xl font-semibold tracking-tight text-[#18181B]"
        >
          Order Summary &amp; Checkout
        </h2>
        {cart.length > 0 && !isConfirmed && (
          <button
            type="button"
            onClick={onClearCart}
            data-testid="clear-cart-button"
            className="text-xs font-medium text-stone-500 underline-offset-4 transition-colors hover:text-[#18181B] hover:underline focus-visible:outline-2 focus-visible:outline-[#18181B]"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="mt-4">
        {cart.length === 0 ? (
          <div
            data-testid="empty-cart-state"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-[#F8F7F4] px-6 py-8 text-center"
          >
            <ShoppingBag className="h-6 w-6 text-stone-400" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-[#18181B]">Your cart is empty</p>
            <p className="mt-1 text-xs text-stone-500">
              Add an item from the catalog to calculate your total.
            </p>
          </div>
        ) : (
          <ul aria-label="Cart items" className="divide-y divide-stone-200">
            {cart.map((item) => {
              const product = productsById[item.productId];
              if (!product) return null;
              return (
                <CartItemRow
                  key={item.productId}
                  product={product}
                  quantity={item.quantity}
                  isLocked={isConfirmed}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              );
            })}
          </ul>
        )}
      </div>

      {/* Totals */}
      <div className="mt-5 space-y-2.5 border-t border-stone-200 pt-5 text-sm">
        <div className="flex items-center justify-between text-stone-600">
          <span>Subtotal</span>
          <span data-testid="order-subtotal" className="font-mono tabular-nums">
            {formatCurrency(totalCents)}
          </span>
        </div>
        <div className="flex items-center justify-between text-stone-600">
          <span>Standard Shipping</span>
          <span className="font-mono text-xs text-stone-700">Complimentary</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-stone-200 pt-3">
          <span className="text-base font-semibold text-[#18181B]">Order Total</span>
          <span
            data-testid="order-total"
            className="font-mono text-xl font-semibold text-[#18181B] tabular-nums"
          >
            {formatCurrency(totalCents)}
          </span>
        </div>
      </div>

      {/* Checkout Form */}
      <form noValidate onSubmit={onPlaceOrder} className="mt-6 space-y-5 border-t border-stone-200 pt-6">
        <div>
          <label
            htmlFor="customer-name"
            className="block text-sm font-medium text-[#18181B]"
          >
            Full Name <span className="text-red-700" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="customer-name"
            name="customerName"
            type="text"
            required
            aria-required="true"
            aria-invalid={Boolean(validation.nameError)}
            aria-describedby={validation.nameError ? 'name-error-message' : undefined}
            disabled={isConfirmed}
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            data-testid="customer-name-input"
            className={`mt-1.5 block min-h-[44px] w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#18181B] placeholder:text-stone-400 focus:outline-2 focus:outline-offset-0 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-600 ${
              validation.nameError
                ? 'border-red-600 focus:outline-red-600'
                : 'border-stone-300 focus:border-[#18181B] focus:outline-[#18181B]'
            }`}
          />
          {validation.nameError && (
            <p
              id="name-error-message"
              data-testid="name-error"
              className="mt-1.5 text-xs font-medium text-red-700"
            >
              {validation.nameError}
            </p>
          )}
        </div>

        {hasValidationErrors && (
          <div
            role="alert"
            data-testid="checkout-validation-alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold">Checkout cannot be completed</p>
              <ul className="list-disc space-y-0.5 pl-4 text-xs text-red-800">
                {validation.cartError && (
                  <li data-testid="cart-error">{validation.cartError}</li>
                )}
                {validation.nameError && <li>{validation.nameError}</li>}
              </ul>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isConfirmed}
          data-testid="place-order-button"
          className="inline-flex min-h-[46px] w-full items-center justify-center rounded-lg bg-[#18181B] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B] whitespace-nowrap"
        >
          {isConfirmed ? 'Order Placed' : 'Place Order'}
        </button>
      </form>

      {/* Single Order Confirmation */}
      {confirmation && (
        <div
          role="status"
          aria-live="polite"
          data-testid="order-confirmation"
          className="mt-6 rounded-xl border border-teal-800/20 bg-teal-50/70 p-6 text-[#18181B]"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-teal-800"
              aria-hidden="true"
            />
            <div className="w-full space-y-3">
              <div>
                <h3 className="text-base font-semibold text-teal-950">
                  Order Confirmed
                </h3>
                <p className="mt-1 text-sm text-teal-900">
                  Thank you, <span className="font-semibold">{confirmation.customerName}</span>.
                  Your order has been received.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-teal-800/15 py-3 text-xs">
                <div>
                  <span className="block text-teal-800">Order Reference</span>
                  <span
                    data-testid="order-reference"
                    className="mt-0.5 block font-mono text-sm font-semibold text-teal-950 tabular-nums"
                  >
                    {confirmation.reference}
                  </span>
                </div>
                <div>
                  <span className="block text-teal-800">Total Paid</span>
                  <span
                    data-testid="confirmed-total"
                    className="mt-0.5 block font-mono text-sm font-semibold text-teal-950 tabular-nums"
                  >
                    {formatCurrency(confirmation.totalCents)}
                  </span>
                </div>
              </div>

              <ul className="space-y-1 text-xs text-teal-900">
                {confirmation.items.map((line) => (
                  <li key={line.productId} className="flex items-center justify-between gap-2">
                    <span>
                      {line.quantity} × {line.name}
                    </span>
                    <span className="font-mono tabular-nums">
                      {formatCurrency(line.lineTotalCents)}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={onStartNewOrder}
                data-testid="start-new-order-button"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-teal-800/25 bg-white px-4 py-2 text-xs font-medium text-teal-950 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-900"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Start New Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
