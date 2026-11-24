import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../data/products';
import type { Product } from '../types/checkout';

interface CartItemRowProps {
  product: Product;
  quantity: number;
  isLocked: boolean;
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({
  product,
  quantity,
  isLocked,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const lineTotalCents = product.priceCents * quantity;

  return (
    <li
      data-testid={`cart-item-${product.id}`}
      className="flex flex-col gap-3 border-b border-stone-200 py-4 last:border-b-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#18181B]">{product.name}</p>
          <p className="mt-0.5 font-mono text-xs text-stone-500 tabular-nums">
            {formatCurrency(product.priceCents)} each
          </p>
        </div>
        <p
          data-testid={`line-total-${product.id}`}
          className="font-mono text-sm font-semibold text-[#18181B] tabular-nums shrink-0"
        >
          {formatCurrency(lineTotalCents)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-md border border-stone-300 bg-[#F8F7F4]">
          <button
            type="button"
            disabled={isLocked}
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            aria-label={`Decrease quantity of ${product.name}`}
            data-testid={`cart-decrease-${product.id}`}
            className="inline-flex h-10 w-10 items-center justify-center text-[#18181B] transition-colors hover:bg-stone-200/70 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#18181B]"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <input
            type="number"
            min={1}
            max={99}
            step={1}
            disabled={isLocked}
            value={quantity}
            aria-label={`Quantity for ${product.name}`}
            data-testid={`cart-qty-input-${product.id}`}
            onChange={(e) => {
              const parsed = Number.parseInt(e.target.value, 10);
              if (Number.isNaN(parsed)) return;
              const clamped = Math.max(0, Math.min(99, parsed));
              onUpdateQuantity(product.id, clamped);
            }}
            className="h-10 w-12 bg-transparent text-center font-mono text-sm font-medium text-[#18181B] tabular-nums focus:outline-none disabled:opacity-60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            disabled={isLocked}
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            aria-label={`Increase quantity of ${product.name}`}
            data-testid={`cart-increase-${product.id}`}
            className="inline-flex h-10 w-10 items-center justify-center text-[#18181B] transition-colors hover:bg-stone-200/70 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#18181B]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          disabled={isLocked}
          onClick={() => onRemove(product.id)}
          data-testid={`cart-remove-${product.id}`}
          className="inline-flex min-h-[40px] items-center gap-1.5 px-2 text-xs font-medium text-stone-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#18181B]"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Remove</span>
        </button>
      </div>
    </li>
  );
}
