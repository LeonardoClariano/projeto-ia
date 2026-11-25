import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCookData } from '../hooks/useCookData';
import type { PaymentMethod } from '../types';
import { formatPrice, orderTotal } from '../utils/format';

/** Pagamento simulado: nenhum dado é enviado ou armazenado. */
export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, cooks, payOrder, cancelOrder } = useCookData();
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <>
        <h1>Pedido não encontrado</h1>
        <Link to="/pedidos">Ver meus pedidos</Link>
      </>
    );
  }
  if (order.status !== 'aguardando_pagamento') {
    return (
      <>
        <h1>Este pedido não está aguardando pagamento</h1>
        <Link to={`/pedidos/${order.id}`}>Ver pedido</Link>
      </>
    );
  }
  const cook = cooks.find((c) => c.id === order.cookId);

  return (
    <>
      <h1>Pagamento</h1>
      <p className="banner">Tela simulada: nenhuma cobrança real será feita.</p>
      <section className="form">
        <p className="muted">Pedido de {cook?.name}</p>
        {order.lines.map((l) => (
          <div className="row" key={l.menuItemId}>
            <span>
              {l.qty}× {l.name}
            </span>
            <span>{formatPrice(l.unitPriceCents * l.qty)}</span>
          </div>
        ))}
        <div className="row">
          <strong>Total</strong>
          <strong>{formatPrice(orderTotal(order.lines))}</strong>
        </div>
        <fieldset>
          <legend>Forma de pagamento</legend>
          <label>
            <input
              type="radio"
              name="method"
              checked={method === 'pix'}
              onChange={() => setMethod('pix')}
            />{' '}
            Pix
          </label>
          <label>
            <input
              type="radio"
              name="method"
              checked={method === 'cartao'}
              onChange={() => setMethod('cartao')}
            />{' '}
            Cartão de crédito
          </label>
        </fieldset>
        {method === 'pix' ? (
          <p className="muted">QR Code fictício: 0000.FITMATCH.SIMULADO</p>
        ) : (
          <p className="muted">Cartão fictício final 0000 (nenhum dado é solicitado).</p>
        )}
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            payOrder(order.id, method);
            navigate(`/pedidos/${order.id}`);
          }}
        >
          Confirmar pagamento
        </button>
        <button
          type="button"
          className="btn danger"
          onClick={() => {
            cancelOrder(order.id, 'cliente', 'Desistiu antes de pagar');
            navigate(`/pedidos/${order.id}`);
          }}
        >
          Cancelar pedido
        </button>
      </section>
    </>
  );
}
