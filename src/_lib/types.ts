
export type CategoryBackendType = {
    id: number;
    name: string;
    slug: string;
    image_url?: string | null; 
    parent_id: number | null;
};

export type PageProps = {
  params: {
    slug: string;
  };
}
export type User = {
  id: string;
  firstname: string;
  lastname: string;
};

export type Params = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};
export type Database = unknown;

export type Category = {
  id: number;
  category_name: string;
  parent_id?: number;
  image_url: string;
};

export type CategoryWithImage = Category & { image?: string };

export type CategoryParams = {
  params: {
    category: string;
  };
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
  is_offer: boolean;
  slug: string;
  quantity: number;
  category_men_id: number;
};

export type ProductInDetails = {
  id: number;
  name: string;
  slug: string | null;
  price: number;
  description: string | null;
  image_url: string | null;
  is_offer?: boolean;
  categoryformen: {
    id: number;
    name: string;
    slug: string | null;
    parent: {
      id: number;
      name: string;
      slug: string | null;
    } | null;
  } | null;
  product_variants: {
    size: string;
    price: number | null;
    quantity: number;
  }[];
};

export type ProductInsert = {
  name: string;
  slug: string;
  price: number;
  description: string;
  image_url: string | null;
  category_men_id: number;
  is_offer?: boolean;
};

export type VariantInsert = {
  size: string;
  quantity: number;
  price: number;
  slug: string;
};


