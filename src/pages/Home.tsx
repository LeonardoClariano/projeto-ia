import { Link } from 'react-router-dom';
import { useCookData } from '../hooks/useCookData';

export default function Home() {
  const { cooks } = useCookData();
  return (
    <>
      <h1>FitMatch</h1>
      <p className="muted">Cozinheiros de comida fitness. Escolha um perfil para ver.</p>
      <ul className="list">
        {cooks.map((c) => (
          <li key={c.id}>
            <Link className="card row link-card" to={`/cozinheiro/${c.id}`}>
              <span className="avatar">{c.avatarEmoji}</span>
              <span>
                <strong>{c.name}</strong>
                <br />
                <span className="muted">
                  {c.handle} · ⭐ {c.rating}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
