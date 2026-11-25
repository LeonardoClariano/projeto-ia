import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { cooks, initialMenuItems, initialPosts } from '../data/mock';
import type { Cook, MenuItem, Post } from '../types';

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
}

const CookDataContext = createContext<CookDataValue | null>(null);

/** Estado em memória (mock): reinicia ao recarregar a página. */
export function CookDataProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

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
    }),
    [posts, menuItems, addPost, removePost, addMenuItem, updateMenuItem, removeMenuItem],
  );
  return <CookDataContext.Provider value={value}>{children}</CookDataContext.Provider>;
}

export function useCookData(): CookDataValue {
  const ctx = useContext(CookDataContext);
  if (!ctx) throw new Error('useCookData deve ser usado dentro de CookDataProvider');
  return ctx;
}
