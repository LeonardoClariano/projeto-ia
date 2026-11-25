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
