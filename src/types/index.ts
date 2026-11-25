export interface Cook {
  id: string;
  name: string;
  handle: string;
  bio: string;
  city: string;
  avatarEmoji: string;
  rating: number;
  reviewsCount: number;
  followers: number;
  /** Especialidades exibidas na descoberta */
  tags: string[];
}

export interface Post {
  id: string;
  cookId: string;
  title: string;
  description: string;
  /** URL da imagem (opcional); sem ela usa-se o emoji como capa */
  imageUrl?: string;
  emoji: string;
  menuItemId?: string;
  likes: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  cookId: string;
  name: string;
  description: string;
  priceCents: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
}

export type OrderStatus =
  | 'aguardando_pagamento'
  | 'aguardando_cozinheiro'
  | 'aceito'
  | 'entregue'
  | 'recusado'
  | 'cancelado';

export type PaymentMethod = 'pix' | 'cartao';

export interface OrderLine {
  menuItemId: string;
  name: string;
  emoji: string;
  unitPriceCents: number;
  qty: number;
}

export interface Order {
  id: string;
  cookId: string;
  lines: OrderLine[];
  note?: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  /** Quem cancelou/recusou */
  canceledBy?: 'cliente' | 'cozinheiro';
  reason?: string;
  /** Avaliação (1 a 5 estrelas) feita após a entrega */
  stars?: number;
  createdAt: string;
}
