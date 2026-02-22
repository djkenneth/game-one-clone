export type UserRole = 'ADMIN' | 'USER' | 'SELLER';

export type User = {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile | null;
  addresses?: Address[];
};

export type Profile = {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  birthday?: string | null;
};

export type Address = {
  id: number;
  userId: number;
  fullName: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  parentId?: number | null;
  children?: Category[];
};

export type Brand = {
  id: number;
  name: string;
  logoUrl?: string | null;
};

export type ProductImage = {
  id: number;
  productId: number;
  variantId?: number | null;
  url: string;
  altText?: string | null;
  position: number;
};

export type ProductOptionValue = {
  id: number;
  optionId: number;
  value: string;
  position: number;
};

export type ProductOption = {
  id: number;
  productId: number;
  name: string;
  position: number;
  values: ProductOptionValue[];
};

export type ProductTag = {
  id: number;
  productId: number;
  tag: string;
};

export type ProductVariant = {
  id: number;
  productId: number;
  sku: string;
  title?: string | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  costPrice?: string | number | null;
  stock: number;
  weight?: string | number | null;
  barcode?: string | null;
  position: number;
  taxable: boolean;
  inventoryPolicy: string;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  isActive: boolean;
  images?: ProductImage[];
};

export type Product = {
  id: number;
  shopId: number;
  categoryId: number;
  brandId?: number | null;
  name: string;
  handle?: string | null;
  description?: string | null;
  bodyHtml?: string | null;
  productType?: string | null;
  status?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  brand?: Brand | null;
  shop: { id: number; name: string };
  variants?: ProductVariant[];
  images?: ProductImage[];
  options?: ProductOption[];
  tags?: ProductTag[];
};

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type OrderItem = {
  id: number;
  orderId: number;
  productVariantId: number;
  quantity: number;
  price: string | number;
  variant?: ProductVariant & { product: { id: number; name: string } };
};

export type Payment = {
  id: number;
  orderId: number;
  userId: number;
  method: string;
  amount: string | number;
  status: PaymentStatus;
  paidAt?: string | null;
};

export type Refund = {
  id: number;
  paymentId: number;
  orderId: number;
  amount: string | number;
  status?: string | null;
  processedAt?: string | null;
};

export type ShipmentStatus = 'PENDING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export type ShipmentEvent = {
  id: number;
  shipmentId: number;
  status: string;
  location?: string | null;
  occurredAt: string;
};

export type Shipment = {
  id: number;
  orderId: number;
  shippingFee: string | number;
  status: ShipmentStatus;
  trackingNumber?: string | null;
  shippedAt?: string | null;
  events?: ShipmentEvent[];
};

export type Order = {
  id: number;
  userId: number;
  shopId: number;
  addressId: number;
  totalAmount: string | number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; email: string };
  shop?: { id: number; name: string };
  address?: Address;
  items?: OrderItem[];
  payment?: Payment | null;
  shipment?: Shipment | null;
  refunds?: Refund[];
};

export type Shop = {
  id: number;
  ownerId: number;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  status?: string | null;
  createdAt: string;
  owner?: { id: number; email: string };
};

export type SellerAccount = {
  id: number;
  userId: number;
  shopId: number;
  verified: boolean;
  status?: string | null;
  createdAt: string;
};

export type Review = {
  id: number;
  productId: number;
  orderItemId: number;
  userId: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: { id: number; email: string; profile?: Profile | null };
};

export type Wallet = {
  id: number;
  userId: number;
  balance: string | number;
  lastUpdated: string;
};

export type Transaction = {
  id: number;
  walletId: number;
  type: string;
  amount: string | number;
  status?: string | null;
  createdAt: string;
};
