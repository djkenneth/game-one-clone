export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  slug: string;
  title: string;
  price: number;
  availability: boolean;
  image: string;
  description: string;
  sku: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  categories: Category[];
  tags: string;
};
