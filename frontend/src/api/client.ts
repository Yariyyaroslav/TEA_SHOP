import type { CartItem, CustomerData, OrderResponse, Tea } from '../types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Помилка запиту';
    throw new Error(message);
  }

  return data as T;
}

export async function fetchTeas(category?: string): Promise<{ teas: Tea[]; categories: string[] }> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/api/teas${query}`);
}

export async function fetchTeaBySlug(slug: string): Promise<Tea> {
  const data = await request<{ tea: Tea }>(`/api/teas/${slug}`);
  return data.tea;
}

export async function createOrder(customer: CustomerData, items: CartItem[]): Promise<OrderResponse> {
  return request<OrderResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      customer,
      items: items.map(item => ({ teaId: item.teaId, quantity: item.quantity }))
    })
  });
}
