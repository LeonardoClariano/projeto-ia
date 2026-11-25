import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCookData } from '../hooks/useCookData';
import { formatPrice, orderTotal } from '../utils/format';

/** Pedido a partir do cardápio do cozinheiro (simulado). Não exige seguir o cozinheiro. */
export default function Checkout() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { cooks, menuItems, createOrder } = useCookData();
  const cook = cooks.find((c) => c.id === id);
  const cookMenu = menuItems.filter((m) => m.cookId === id);
  const preselected = params.get('item');
  const [qty, setQty] = useState<Record<string, number>>(preselected ? { [preselected]: 1 } : {});
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!cook) {
    return (
      <>
        <h1>Cozinheiro não encontrado</h1>
        <Link to="/">Voltar ao início</Link>
      </>
    );
  }

  const lines = cookMenu
    .filter((m) => (qty[m.id] ?? 0) > 0)
    .map((m) => ({
      menuItemId: m.id,
      name: m.name,
      emoji: m.emoji,
      unitPriceCents: m.priceCents,
      qty: qty[m.id],
    }));
  const total = orderTotal(lines);
  const change = (itemId: string, delta: number) =>
    setQty((prev) => ({
      ...prev,
      [itemId]: Math.max(0, Math.min(20, (prev[itemId] ?? 0) + delta)),
    }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      setError('Escolha ao menos um item do cardápio.');
      return;
    }
    const orderId = createOrder(cook.id, lines, note.trim() || undefined);
    navigate(`/pedidos/${orderId}/pagamento`);
  };

  return (
    <>
      <h1>Pedir de {cook.name}</h1>
      <p className="banner">Simulação: nenhum pedido real é enviado nem cobrado.</p>
      <form className="form" onSubmit={submit}>
        {cookMenu.length === 0 && <p className="muted">Cardápio vazio.</p>}
        {cookMenu.map((m) => (
          <div className="row" key={m.id}>
            <div>
              <strong>
                {m.emoji} {m.name}
              </strong>
              <div className="muted">{formatPrice(m.priceCents)}</div>
            </div>
            <div className="qty">
              <button
                type="button"
                className="btn"
                aria-label={`Diminuir ${m.name}`}
                onClick={() => change(m.id, -1)}
              >
                −
              </button>
              <span aria-live="polite">{qty[m.id] ?? 0}</span>
              <button
                type="button"
                className="btn"
                aria-label={`Aumentar ${m.name}`}
                onClick={() => change(m.id, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
        <label>
          Observações (opcional)
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className="row">
          <strong>Total</strong>
          <strong>{formatPrice(total)}</strong>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn primary">
          Continuar para pagamento
        </button>
      </form>
    </>
  );
}
