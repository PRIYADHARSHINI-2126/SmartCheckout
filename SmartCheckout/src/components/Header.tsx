interface HeaderProps {
  totalQuantity: number;
  onJumpToCheckout: () => void;
}

export function Header({ totalQuantity, onJumpToCheckout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#F8F7F4]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#top"
          className="font-display text-2xl font-semibold tracking-tight text-[#18181B] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#18181B]"
        >
          Alder &amp; Clay
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex"
        >
          <a
            href="#catalog"
            className="transition-colors duration-150 hover:text-[#18181B] whitespace-nowrap shrink-0"
          >
            Catalog
          </a>
          <a
            href="#checkout"
            className="transition-colors duration-150 hover:text-[#18181B] whitespace-nowrap shrink-0"
          >
            Order Summary
          </a>
          <a
            href="#checkout"
            className="transition-colors duration-150 hover:text-[#18181B] whitespace-nowrap shrink-0"
          >
            Checkout
          </a>
          <a
            href="#shipping-note"
            className="transition-colors duration-150 hover:text-[#18181B] whitespace-nowrap shrink-0"
          >
            Policies
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onJumpToCheckout}
            data-testid="header-cart-button"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-[#18181B] transition-colors duration-150 hover:border-[#18181B] hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B] whitespace-nowrap shrink-0"
          >
            <span>Cart</span>
            <span
              data-testid="header-cart-count"
              className="font-mono text-xs font-medium text-stone-600 tabular-nums"
            >
              ({totalQuantity})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
