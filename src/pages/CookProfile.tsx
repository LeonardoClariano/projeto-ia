import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';
import PostCard from '../components/PostCard';
import { CURRENT_COOK_ID } from '../data/mock';
import { useCookData } from '../hooks/useCookData';

type Tab = 'posts' | 'menu';

export default function CookProfile() {
  const { id } = useParams();
  const { cooks, posts, menuItems, removePost, followedIds, toggleFollow } = useCookData();
  const [tab, setTab] = useState<Tab>('posts');
  const cook = cooks.find((c) => c.id === id);

  if (!cook) {
    return (
      <>
        <h1>Cozinheiro não encontrado</h1>
        <Link to="/">Voltar ao início</Link>
      </>
    );
  }

  const isOwner = cook.id === CURRENT_COOK_ID;
  const following = followedIds.includes(cook.id);
  const cookPosts = posts
    .filter((p) => p.cookId === cook.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const cookMenu = menuItems.filter((m) => m.cookId === cook.id);

  return (
    <>
      <header className="profile">
        <div className="avatar big">{cook.avatarEmoji}</div>
        <h1>{cook.name}</h1>
        <p className="muted">
          {cook.handle} · {cook.city}
        </p>
        <p>{cook.bio}</p>
        <div className="stats">
          <div>
            <strong>{cookPosts.length}</strong>
            <span>publicações</span>
          </div>
          <div>
            <strong>{cook.followers + (following && !isOwner ? 1 : 0)}</strong>
            <span>seguidores</span>
          </div>
          <div>
            <strong>⭐ {cook.rating}</strong>
            <span>{cook.reviewsCount} avaliações</span>
          </div>
        </div>
        {!isOwner && (
          <div className="row">
            <button
              type="button"
              className={`btn ${following ? '' : 'primary'}`}
              aria-pressed={following}
              onClick={() => toggleFollow(cook.id)}
            >
              {following ? 'Seguindo' : 'Seguir'}
            </button>
          </div>
        )}
        {isOwner && (
          <div className="row">
            <Link className="btn primary" to="/cozinheiro/publicar">
              Nova publicação
            </Link>
            <Link className="btn" to="/cozinheiro/cardapio">
              Gerenciar cardápio
            </Link>
          </div>
        )}
      </header>

      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'posts'}
          onClick={() => setTab('posts')}
        >
          Publicações
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'menu'}
          onClick={() => setTab('menu')}
        >
          Cardápio
        </button>
      </div>

      {tab === 'posts' && (
        <section className="list">
          {cookPosts.length === 0 && <p className="muted">Nenhuma publicação ainda.</p>}
          {cookPosts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              menuItem={menuItems.find((m) => m.id === p.menuItemId)}
              onRemove={isOwner ? () => removePost(p.id) : undefined}
            />
          ))}
        </section>
      )}
      {tab === 'menu' && (
        <section className="list">
          {cookMenu.length === 0 && <p className="muted">Cardápio vazio.</p>}
          {cookMenu.map((m) => (
            <MenuItemCard
              key={m.id}
              item={m}
              orderTo={isOwner ? undefined : `/cozinheiro/${cook.id}/pedido?item=${m.id}`}
            />
          ))}
        </section>
      )}
    </>
  );
}
