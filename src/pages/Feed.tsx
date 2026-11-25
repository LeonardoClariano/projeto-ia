import { useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useCookData } from '../hooks/useCookData';

type Filter = 'all' | 'following';

export default function Feed() {
  const { cooks, posts, menuItems, followedIds, toggleFollow, likedPostIds, toggleLike } =
    useCookData();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = posts
    .filter((p) => filter === 'all' || followedIds.includes(p.cookId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <h1>Feed</h1>
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'following'}
          onClick={() => setFilter('following')}
        >
          Seguindo ({followedIds.length})
        </button>
      </div>

      <section className="list">
        {visible.length === 0 && (
          <p className="muted">
            {filter === 'following'
              ? 'Você ainda não segue ninguém com publicações. '
              : 'Nenhuma publicação ainda. '}
            <Link to="/">Descobrir cozinheiros</Link>
          </p>
        )}
        {visible.map((p) => {
          const cook = cooks.find((c) => c.id === p.cookId);
          if (!cook) return null;
          const following = followedIds.includes(cook.id);
          return (
            <div key={p.id}>
              <div className="row feed-head">
                <Link className="row wrap link-inline" to={`/cozinheiro/${cook.id}`}>
                  <span className="avatar">{cook.avatarEmoji}</span>
                  <span>
                    <strong>{cook.name}</strong>
                    <br />
                    <span className="muted">{cook.handle}</span>
                  </span>
                </Link>
                <button
                  type="button"
                  className={`btn ${following ? '' : 'primary'}`}
                  aria-pressed={following}
                  onClick={() => toggleFollow(cook.id)}
                >
                  {following ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
              <PostCard
                post={p}
                menuItem={menuItems.find((m) => m.id === p.menuItemId)}
                liked={likedPostIds.includes(p.id)}
                onToggleLike={() => toggleLike(p.id)}
              />
            </div>
          );
        })}
      </section>
    </>
  );
}
