import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCookData } from '../hooks/useCookData';
import { formatPrice, orderTotal, statusLabels } from '../utils/format';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, cooks, respondOrder, cancelOrder, deliverOrder, rateOrder } = useCookData();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <>
        <h1>Pedido não encontrado</h1>
        <Link to="/pedidos">Ver meus pedidos</Link>
      </>
    );
  }
  const cook = cooks.find((c) => c.id === order.cookId);
  const bad = order.status === 'recusado' || order.status === 'cancelado';
  const canCancel = order.status === 'aguardando_cozinheiro' || order.status === 'aceito';

  return (
    <>
      <h1>Pedido</h1>
      <section className="form">
        <div className="row">
          <Link to={`/cozinheiro/${order.cookId}`}>{cook?.name}</Link>
          <span className={`badge ${bad ? 'bad' : ''}`}>{statusLabels[order.status]}</span>
        </div>
        {order.lines.map((l) => (
          <div className="row" key={l.menuItemId}>
            <span>
              {l.emoji} {l.qty}× {l.name}
            </span>
            <span>{formatPrice(l.unitPriceCents * l.qty)}</span>
          </div>
        ))}
        {order.note && <p className="muted">Obs.: {order.note}</p>}
        <div className="row">
          <strong>Total</strong>
          <strong>{formatPrice(orderTotal(order.lines))}</strong>
        </div>
        {order.paymentMethod && (
          <p className="muted">
            Pago via {order.paymentMethod === 'pix' ? 'Pix' : 'cartão'} (simulado)
          </p>
        )}

        {order.status === 'aguardando_pagamento' && (
          <button
            type="button"
            className="btn primary"
            onClick={() => navigate(`/pedidos/${order.id}/pagamento`)}
          >
            Ir para pagamento
          </button>
        )}

        {bad && (
          <div className="banner" role="status">
            <strong>
              {order.status === 'recusado'
                ? 'O cozinheiro recusou este pedido.'
                : `Pedido cancelado pel${order.canceledBy === 'cozinheiro' ? 'o cozinheiro' : 'o cliente'}.`}
            </strong>
            {order.reason && <div>Motivo: {order.reason}</div>}
            {order.paymentMethod && (
              <div>
                Reembolso: combinado diretamente entre cliente e cozinheiro, conforme as compras dos
                ingredientes (simulado).
              </div>
            )}
          </div>
        )}

        {order.status === 'entregue' && (
          <div>
            <p>Avalie {cook?.name}:</p>
            <div className="stars" role="group" aria-label="Avaliação em estrelas">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={(order.stars ?? 0) >= n ? 'on' : ''}
                  aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
                  aria-pressed={order.stars === n}
                  onClick={() => rateOrder(order.id, n)}
                >
                  ★
                </button>
              ))}
            </div>
            {order.stars && (
              <p className="muted">Obrigado! Você deu {order.stars} de 5 estrelas.</p>
            )}
          </div>
        )}

        {canCancel && (
          <>
            <button
              type="button"
              className="btn danger"
              onClick={() => cancelOrder(order.id, 'cliente', 'Cancelado pelo cliente')}
            >
              Cancelar pedido (cliente)
            </button>
            <p className="banner">Simulação — ações do cozinheiro para demonstrar os fluxos:</p>
            <div className="row wrap">
              {order.status === 'aguardando_cozinheiro' && (
                <>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => respondOrder(order.id, true)}
                  >
                    Cozinheiro aceita
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() =>
                      respondOrder(order.id, false, 'Sem ingredientes disponíveis no momento')
                    }
                  >
                    Cozinheiro recusa
                  </button>
                </>
              )}
              {order.status === 'aceito' && (
                <button type="button" className="btn" onClick={() => deliverOrder(order.id)}>
                  Marcar como entregue
                </button>
              )}
              <button
                type="button"
                className="btn danger"
                onClick={() => cancelOrder(order.id, 'cozinheiro', 'Imprevisto do cozinheiro')}
              >
                Cozinheiro cancela
              </button>
            </div>
          </>
        )}
        <Link to="/pedidos">Voltar aos pedidos</Link>
      </section>
    </>
  );
}
