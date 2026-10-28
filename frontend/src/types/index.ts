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
  errors?: Record<string, string>;
  order: {
    id: string;
    orderNumber: string;
    total: number;
    currency: 'UAH';
    status: string;
    createdAt: string;
  };
};
