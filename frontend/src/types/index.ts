export type Tea = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image?: string;
  price: number;
  featured?: boolean;
};

export type CartItem = {
  teaId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export type CustomerData = {
  name: string;
  phone: string;
  address: string;
  comment: string;
};

export type OrderResponse = {
  message: string;
  order: {
    id: string;
    total: number;
    createdAt: string;
  };
};
