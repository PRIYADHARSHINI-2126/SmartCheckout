import { useState } from 'react';
import { Minus, Plus, Package, Trash2 } from 'lucide-react';
import { formatCurrency } from '../data/products';
import type { Product } from '../types/checkout';

interface ProductCardProps {
  product: Product;
  quantity: number;
  isLocked: boolean;
  onAdd: (productId: string) => void;
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemove: (productId: string) => void;
}

export function ProductCard({
  product,
  quantity,
  isLocked,
  onAdd,
  onUpdateQuantity,
  onRemove,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-transform duration-150 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {!imageFailed ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-stone-100 p-6 text-stone-500">
            <Package className="h-8 w-8 stroke-[1.5]" aria-hidden="true" />
            <span className="text-sm font-medium text-stone-700">{product.name}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5 p-6">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-stone-500">
            {product.subtitle}
          </p>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-[#18181B]">
              {product.name}
            </h2>
            <span
              data-testid={`product-price-${product.id}`}
              className="font-mono text-base font-medium text-[#18181B] tabular-nums shrink-0"
            >
              {formatCurrency(product.priceCents)}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-stone-600">{product.description}</p>
        </div>

        <div className="border-t border-stone-100 pt-4">
          {quantity === 0 ? (
            <button
              type="button"
              disabled={isLocked}
              onClick={() => onAdd(product.id)}
              data-testid={`add-to-cart-${product.id}`}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B] whitespace-nowrap"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-lg border border-stone-300 bg-[#F8F7F4]">
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  aria-label={`Decrease quantity of ${product.name}`}
                  data-testid={`catalog-decrease-${product.id}`}
                  className="inline-flex h-11 w-11 items-center justify-center text-[#18181B] transition-colors hover:bg-stone-200/70 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#18181B]"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span
                  data-testid={`catalog-qty-${product.id}`}
                  className="min-w-[2.5rem] text-center font-mono text-sm font-medium text-[#18181B] tabular-nums"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  aria-label={`Increase quantity of ${product.name}`}
                  data-testid={`catalog-increase-${product.id}`}
                  className="inline-flex h-11 w-11 items-center justify-center text-[#18181B] transition-colors hover:bg-stone-200/70 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#18181B]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                disabled={isLocked}
                onClick={() => onRemove(product.id)}
                aria-label={`Remove ${product.name} from cart`}
                data-testid={`catalog-remove-${product.id}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-[#18181B] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#18181B] whitespace-nowrap"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
