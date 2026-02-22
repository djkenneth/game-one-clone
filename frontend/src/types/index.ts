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

export type CartItem = {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
  price: string | number;
  variant: ProductVariant & {
    product: { id: number; name: string };
  };
};

export type Cart = {
  id: number;
  userId: number;
  isActive: boolean;
  updatedAt: string;
  items: CartItem[];
};

export type OrderItem = {
  id: number;
  orderId: number;
  productVariantId: number;
  quantity: number;
  price: string | number;
  variant?: ProductVariant & {
    product: { id: number; name: string };
  };
};

export type Order = {
  id: number;
  userId: number;
  shopId: number;
  addressId: number;
  totalAmount: string | number;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  address?: Address;
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

export type Profile = {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  birthday?: string | null;
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
