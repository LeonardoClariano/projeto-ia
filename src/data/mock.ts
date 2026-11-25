import type { Cook, MenuItem, Post } from '../types';

/** Cozinheiro "logado" na simulação da área do cozinheiro */
export const CURRENT_COOK_ID = 'c1';

export const cooks: Cook[] = [
  {
    id: 'c1',
    name: 'Marina Duarte',
    handle: '@marina.fit',
    bio: 'Nutricionista e cozinheira. Marmitas low carb e high protein feitas com carinho.',
    city: 'São Paulo, SP',
    avatarEmoji: '👩‍🍳',
    rating: 4.8,
    reviewsCount: 126,
    followers: 1280,
  },
  {
    id: 'c2',
    name: 'Rafael Souza',
    handle: '@rafa.cozinha',
    bio: 'Comida de verdade para quem treina. Foco em ganho de massa.',
    city: 'Belo Horizonte, MG',
    avatarEmoji: '👨‍🍳',
    rating: 4.6,
    reviewsCount: 74,
    followers: 640,
  },
];

export const initialMenuItems: MenuItem[] = [
  {
    id: 'm1',
    cookId: 'c1',
    name: 'Frango grelhado com batata-doce',
    description: 'Peito de frango temperado, batata-doce assada e brócolis.',
    priceCents: 2290,
    calories: 480,
    protein: 42,
    carbs: 45,
    fat: 8,
    emoji: '🍗',
  },
  {
    id: 'm2',
    cookId: 'c1',
    name: 'Bowl de salmão e quinoa',
    description: 'Salmão assado, quinoa, abacate e legumes salteados.',
    priceCents: 3490,
    calories: 560,
    protein: 38,
    carbs: 40,
    fat: 22,
    emoji: '🍣',
  },
  {
    id: 'm3',
    cookId: 'c2',
    name: 'Carne moída com arroz integral',
    description: 'Patinho moído, arroz integral e feijão.',
    priceCents: 2190,
    calories: 620,
    protein: 45,
    carbs: 60,
    fat: 14,
    emoji: '🥩',
  },
];

export const initialPosts: Post[] = [
  {
    id: 'p1',
    cookId: 'c1',
    title: 'Marmitas da semana prontas!',
    description: 'Frango com batata-doce saiu do forno agora. Pedidos abertos.',
    emoji: '🍱',
    menuItemId: 'm1',
    likes: 87,
    createdAt: '2026-11-20T10:00:00Z',
  },
  {
    id: 'p2',
    cookId: 'c1',
    title: 'Novo no cardápio: bowl de salmão',
    description: 'Rico em ômega 3 e super saciante.',
    emoji: '🥗',
    menuItemId: 'm2',
    likes: 154,
    createdAt: '2026-11-15T15:30:00Z',
  },
  {
    id: 'p3',
    cookId: 'c2',
    title: 'Pós-treino perfeito',
    description: 'Carne moída com arroz integral, 45g de proteína.',
    emoji: '💪',
    menuItemId: 'm3',
    likes: 42,
    createdAt: '2026-11-18T12:00:00Z',
  },
];
