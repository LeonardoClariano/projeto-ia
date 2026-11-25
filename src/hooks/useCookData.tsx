import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { cooks, initialMenuItems, initialPosts } from '../data/mock';
import type { Cook, MenuItem, Order, OrderLine, PaymentMethod, Post } from '../types';

export type NewPost = Pick<Post, 'title' | 'description' | 'imageUrl' | 'emoji' | 'menuItemId'>;
export type MenuItemInput = Omit<MenuItem, 'id' | 'cookId'>;

interface CookDataValue {
  cooks: Cook[];
  posts: Post[];
  menuItems: MenuItem[];
  addPost: (cookId: string, data: NewPost) => void;
  removePost: (id: string) => void;
  addMenuItem: (cookId: string, data: MenuItemInput) => void;
  updateMenuItem: (id: string, data: MenuItemInput) => void;
  removeMenuItem: (id: string) => void;
  /** IDs dos cozinheiros seguidos pelo cliente (mock) */
  followedIds: string[];
  toggleFollow: (cookId: string) => void;
  likedPostIds: string[];
  toggleLike: (postId: string) => void;
  /** Pedidos simulados (sem cobrança real) */
  orders: Order[];
  createOrder: (cookId: string, lines: OrderLine[], note?: string) => string;
  payOrder: (id: string, method: PaymentMethod) => void;
  /** Simula a resposta do cozinheiro: aceitar ou recusar */
  respondOrder: (id: string, accept: boolean, reason?: string) => void;
  cancelOrder: (id: string, by: 'cliente' | 'cozinheiro', reason?: string) => void;
  deliverOrder: (id: string) => void;
  rateOrder: (id: string, stars: number) => void;
}

const CookDataContext = createContext<CookDataValue | null>(null);

/** Estado em memória (mock): reinicia ao recarregar a página. */
export function CookDataProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const [followedIds, setFollowedIds] = useState<string[]>(['c1']);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  const toggleFollow = useCallback((cookId: string) => {
    setFollowedIds((prev) =>
      prev.includes(cookId) ? prev.filter((i) => i !== cookId) : [...prev, cookId],
    );
  }, []);
  const toggleLike = useCallback((postId: string) => {
    setLikedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((i) => i !== postId) : [...prev, postId],
    );
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);
  const patchOrder = useCallback((id: string, patch: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);
  const createOrder = useCallback((cookId: string, lines: OrderLine[], note?: string) => {
    const id = `o${Date.now()}`;
    const order: Order = {
      id,
      cookId,
      lines,
      note,
      status: 'aguardando_pagamento',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return id;
  }, []);
  const payOrder = useCallback(
    (id: string, method: PaymentMethod) =>
      patchOrder(id, { status: 'aguardando_cozinheiro', paymentMethod: method }),
    [patchOrder],
  );
  const respondOrder = useCallback(
    (id: string, accept: boolean, reason?: string) =>
      patchOrder(
        id,
        accept ? { status: 'aceito' } : { status: 'recusado', canceledBy: 'cozinheiro', reason },
      ),
    [patchOrder],
  );
  const cancelOrder = useCallback(
    (id: string, by: 'cliente' | 'cozinheiro', reason?: string) =>
      patchOrder(id, { status: 'cancelado', canceledBy: by, reason }),
    [patchOrder],
  );
  const deliverOrder = useCallback(
    (id: string) => patchOrder(id, { status: 'entregue' }),
    [patchOrder],
  );
  const rateOrder = useCallback(
    (id: string, stars: number) => patchOrder(id, { stars }),
    [patchOrder],
  );

  const addPost = useCallback((cookId: string, data: NewPost) => {
    const post: Post = {
      ...data,
      id: `p${Date.now()}`,
      cookId,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
  }, []);
  const removePost = useCallback(
    (id: string) => setPosts((prev) => prev.filter((p) => p.id !== id)),
    [],
  );
  const addMenuItem = useCallback((cookId: string, data: MenuItemInput) => {
    setMenuItems((prev) => [...prev, { ...data, id: `m${Date.now()}`, cookId }]);
  }, []);
  const updateMenuItem = useCallback((id: string, data: MenuItemInput) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  }, []);
  const removeMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    setPosts((prev) =>
      prev.map((p) => (p.menuItemId === id ? { ...p, menuItemId: undefined } : p)),
    );
  }, []);

  const value = useMemo(
    () => ({
      cooks,
      posts,
      menuItems,
      addPost,
      removePost,
      addMenuItem,
      updateMenuItem,
      removeMenuItem,
      followedIds,
      toggleFollow,
      likedPostIds,
      toggleLike,
      orders,
      createOrder,
      payOrder,
      respondOrder,
      cancelOrder,
      deliverOrder,
      rateOrder,
    }),
    [
      posts,
      menuItems,
      addPost,
      removePost,
      addMenuItem,
      updateMenuItem,
      removeMenuItem,
      followedIds,
      toggleFollow,
      likedPostIds,
      toggleLike,
      orders,
      createOrder,
      payOrder,
      respondOrder,
      cancelOrder,
      deliverOrder,
      rateOrder,
    ],
  );
  return <CookDataContext.Provider value={value}>{children}</CookDataContext.Provider>;
}

export function useCookData(): CookDataValue {
  const ctx = useContext(CookDataContext);
  if (!ctx) throw new Error('useCookData deve ser usado dentro de CookDataProvider');
  return ctx;
}
