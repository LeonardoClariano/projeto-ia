import type { MenuItem, Post } from '../types';
import { formatDate } from '../utils/format';

interface Props {
  post: Post;
  menuItem?: MenuItem;
  onRemove?: () => void;
}

export default function PostCard({ post, menuItem, onRemove }: Props) {
  return (
    <article className="card">
      <div className="cover" aria-hidden={!post.imageUrl}>
        {post.imageUrl ? <img src={post.imageUrl} alt={post.title} /> : <span>{post.emoji}</span>}
      </div>
      <div className="card-body">
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        {menuItem && <p className="tag">🍽️ {menuItem.name}</p>}
        <div className="row muted">
          <span>❤️ {post.likes}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        {onRemove && (
          <button type="button" className="btn danger" onClick={onRemove}>
            Excluir publicação
          </button>
        )}
      </div>
    </article>
  );
}
