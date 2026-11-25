import { Link } from 'react-router-dom';
import { useCookData } from '../hooks/useCookData';
import { formatPrice, orderTotal, statusLabels } from '../utils/format';

export default function Orders() {
  const { orders, cooks } = useCookData();
  return (
    <>
      <h1>Meus pedidos</h1>
      <section className="list">
        {orders.length === 0 && (
          <p className="muted">
            Nenhum pedido ainda. <Link to="/">Descubra cozinheiros</Link> e peça pelo cardápio.
          </p>
        )}
        {orders.map((o) => {
          const bad = o.status === 'recusado' || o.status === 'cancelado';
          return (
            <Link key={o.id} to={`/pedidos/${o.id}`} className="card link-card">
              <div className="card-body">
                <h3>{cooks.find((c) => c.id === o.cookId)?.name}</h3>
                <p className="muted">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</p>
                <div className="row">
                  <span className={`badge ${bad ? 'bad' : ''}`}>{statusLabels[o.status]}</span>
                  <strong>{formatPrice(orderTotal(o.lines))}</strong>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
