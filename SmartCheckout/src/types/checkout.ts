export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  imageAlt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ConfirmedLineItem {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface OrderConfirmation {
  reference: string;
  customerName: string;
  placedAt: string;
  items: ConfirmedLineItem[];
  totalCents: number;
}

export interface CheckoutValidation {
  cartError: string | null;
  nameError: string | null;
}
