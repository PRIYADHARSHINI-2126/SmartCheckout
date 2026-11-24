import { useMemo, useRef, useState, type FormEvent } from 'react';
import { CheckoutPanel } from './components/CheckoutPanel';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import {
  PRODUCTS,
  generateOrderReference,
} from './data/products';
import type {
  CartItem,
  CheckoutValidation,
  ConfirmedLineItem,
  OrderConfirmation,
  Product,
} from './types/checkout';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [validation, setValidation] = useState<CheckoutValidation>({
    cartError: null,
    nameError: null,
  });
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const submissionLockRef = useRef(false);

  const productsById = useMemo<Record<string, Product>>(() => {
    return PRODUCTS.reduce<Record<string, Product>>((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, []);

  const quantityById = useMemo<Record<string, number>>(() => {
    return cart.reduce<Record<string, number>>((acc, item) => {
      acc[item.productId] = item.quantity;
      return acc;
    }, {});
  }, [cart]);

  const totalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const totalCents = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = productsById[item.productId];
        return product ? sum + product.priceCents * item.quantity : sum;
      }, 0),
    [cart, productsById],
  );

  const handleAddItem = (productId: string) => {
    if (confirmation || submissionLockRef.current) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(99, item.quantity + 1) }
            : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    setValidation((prev) => ({ ...prev, cartError: null }));
  };

  const handleUpdateQuantity = (productId: string, nextQuantity: number) => {
    if (confirmation || submissionLockRef.current) return;
    if (nextQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const clamped = Math.min(99, nextQuantity);
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: clamped } : item,
      ),
    );
    setValidation((prev) => ({ ...prev, cartError: null }));
  };

  const handleRemoveItem = (productId: string) => {
    if (confirmation || submissionLockRef.current) return;
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    if (confirmation || submissionLockRef.current) return;
    setCart([]);
  };

  const handleCustomerNameChange = (value: string) => {
    if (confirmation || submissionLockRef.current) return;
    setCustomerName(value);
    if (value.trim().length > 0 && validation.nameError) {
      setValidation((prev) => ({ ...prev, nameError: null }));
    }
  };

  const handlePlaceOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submissionLockRef.current || confirmation !== null) {
      return;
    }

    const trimmedName = customerName.trim();
    const cartError =
      cart.length === 0
        ? 'Your cart is empty. Add at least one item before placing an order.'
        : null;
    const nameError =
      trimmedName.length === 0
        ? 'Full Name is required to complete your order.'
        : null;

    if (cartError || nameError) {
      setValidation({ cartError, nameError });
      return;
    }

    submissionLockRef.current = true;

    const confirmedItems: ConfirmedLineItem[] = cart.map((item) => {
      const product = productsById[item.productId];
      return {
        productId: item.productId,
        name: product.name,
        unitPriceCents: product.priceCents,
        quantity: item.quantity,
        lineTotalCents: product.priceCents * item.quantity,
      };
    });

    const confirmedTotalCents = confirmedItems.reduce(
      (sum, item) => sum + item.lineTotalCents,
      0,
    );

    setValidation({ cartError: null, nameError: null });
    setConfirmation({
      reference: generateOrderReference(),
      customerName: trimmedName,
      placedAt: new Date().toISOString(),
      items: confirmedItems,
      totalCents: confirmedTotalCents,
    });
  };

  const handleStartNewOrder = () => {
    submissionLockRef.current = false;
    setConfirmation(null);
    setCart([]);
    setCustomerName('');
    setValidation({ cartError: null, nameError: null });
  };

  const handleJumpToCheckout = () => {
    const el = document.getElementById('checkout');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#18181B]">
      <Header totalQuantity={totalQuantity} onJumpToCheckout={handleJumpToCheckout} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:py-14">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-xs font-medium tracking-wide text-stone-500">
            Studio Collection · Direct Dispatch
          </p>
          <h1
            className="font-display text-4xl font-semibold tracking-tight text-[#18181B] sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            Pour-Over Hardware &amp; Checkout
          </h1>
          <p className="text-base leading-relaxed text-stone-600">
            Select your brewing pieces below, adjust quantities, and enter your full name to
            confirm your order in one step.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <section
            id="catalog"
            aria-label="Product catalog"
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantityById[product.id] ?? 0}
                  isLocked={Boolean(confirmation)}
                  onAdd={handleAddItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </section>

          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <CheckoutPanel
              productsById={productsById}
              cart={cart}
              customerName={customerName}
              validation={validation}
              confirmation={confirmation}
              totalCents={totalCents}
              onCustomerNameChange={handleCustomerNameChange}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onPlaceOrder={handlePlaceOrder}
              onStartNewOrder={handleStartNewOrder}
            />
          </div>
        </div>
      </main>

      <footer
        id="shipping-note"
        className="border-t border-stone-200 bg-white/60 py-8 text-xs text-stone-500"
      >
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 sm:flex-row sm:items-center">
          <p>Alder &amp; Clay Studio · Fixed-price direct checkout with complimentary shipping.</p>
          <p className="font-mono tabular-nums">Orders confirmed with a single reference ID.</p>
        </div>
      </footer>
    </div>
  );
}
