import { useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCookData } from '../hooks/useCookData';

const SWIPE_THRESHOLD = 90;

/** Descoberta estilo Tinder: arraste (ou use os botões) para passar ou seguir. */
export default function Discover() {
  const { cooks, menuItems, followedIds, toggleFollow } = useCookData();
  // Fila inicial: cozinheiros ainda não seguidos (calculada uma vez)
  const [queue, setQueue] = useState<string[]>(() =>
    cooks.filter((c) => !followedIds.includes(c.id)).map((c) => c.id),
  );
  const [dx, setDx] = useState(0);
  const start = useRef<number | null>(null);

  const cook = cooks.find((c) => c.id === queue[0]);

  const decide = (follow: boolean) => {
    if (!cook) return;
    if (follow && !followedIds.includes(cook.id)) toggleFollow(cook.id);
    setQueue((q) => q.slice(1));
    setDx(0);
  };

  const onDown = (e: PointerEvent<HTMLElement>) => {
    start.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (start.current !== null) setDx(e.clientX - start.current);
  };
  const onUp = () => {
    if (start.current === null) return;
    start.current = null;
    if (dx > SWIPE_THRESHOLD) decide(true);
    else if (dx < -SWIPE_THRESHOLD) decide(false);
    else setDx(0);
  };

  if (!cook) {
    return (
      <>
        <h1>Descobrir</h1>
        <div className="card card-body empty">
          <p>🎉 Você viu todos os cozinheiros por enquanto.</p>
          <div className="row wrap">
            <Link className="btn primary" to="/feed">
              Ver feed
            </Link>
            <button type="button" className="btn" onClick={() => setQueue(cooks.map((c) => c.id))}>
              Rever todos
            </button>
          </div>
        </div>
      </>
    );
  }

  const dishes = menuItems.filter((m) => m.cookId === cook.id).slice(0, 2);
  const following = followedIds.includes(cook.id);

  return (
    <>
      <h1>Descobrir</h1>
      <p className="muted">Arraste para a direita para seguir, para a esquerda para passar.</p>
      <article
        key={cook.id}
        className="card swipe-card"
        style={{
          transform: `translateX(${dx}px) rotate(${dx / 20}deg)`,
          transition: start.current === null ? 'transform 0.2s' : 'none',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {dx > 30 && <span className="stamp follow">SEGUIR</span>}
        {dx < -30 && <span className="stamp skip">PASSAR</span>}
        <div className="cover">
          <span>{cook.avatarEmoji}</span>
        </div>
        <div className="card-body">
          <h2>
            {cook.name} <span className="muted">· ⭐ {cook.rating}</span>
          </h2>
          <p className="muted">
            {cook.handle} · {cook.city}
          </p>
          <p>{cook.bio}</p>
          <div className="row wrap">
            {cook.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          {dishes.map((m) => (
            <p key={m.id} className="tag">
              {m.emoji} {m.name}
            </p>
          ))}
          <Link className="muted" to={`/cozinheiro/${cook.id}`}>
            Ver perfil completo
          </Link>
        </div>
      </article>
      <div className="swipe-actions">
        <button
          type="button"
          className="btn round"
          aria-label="Passar"
          onClick={() => decide(false)}
        >
          ✖
        </button>
        <button
          type="button"
          className="btn round primary"
          aria-label={following ? 'Próximo' : 'Seguir'}
          onClick={() => decide(true)}
        >
          ❤
        </button>
      </div>
      <p className="muted center">{queue.length} restante(s)</p>
    </>
  );
}
