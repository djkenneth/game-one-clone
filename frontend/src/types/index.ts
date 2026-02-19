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

export type ProductVariant = {
  id: number;
  productId: number;
  sku: string;
  price: string | number;
  stock: number;
  weight?: string | number | null;
  isActive: boolean;
};

export type Product = {
  id: number;
  shopId: number;
  categoryId: number;
  brandId?: number | null;
  name: string;
  description?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  brand?: Brand | null;
  shop: { id: number; name: string };
  variants?: ProductVariant[];
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
