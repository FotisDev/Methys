import { ReactElement } from "react";

export type MenuOption = {
  Text: string;
  URL: string;
  Target?: boolean;
};
export type SideMenuOption = {
  Text: string;
  URL: string;
  Icon: ReactElement;
  Target?: boolean;
};
export interface PageProps {
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
}

export type CategoryWithImage = Category & { image?: string };

export type CategoryParams = {
  params:{
    category:string,
  }
}

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
}