import { Link } from 'react-router-dom';
import type { MenuItem } from '../types';
import { formatPrice } from '../utils/format';

interface Props {
  item: MenuItem;
  onEdit?: () => void;
  onRemove?: () => void;
  /** Link para iniciar um pedido simulado deste item */
  orderTo?: string;
}

export default function MenuItemCard({ item, onEdit, onRemove, orderTo }: Props) {
  return (
    <article className="card menu-item">
      <div className="emoji" aria-hidden="true">
        {item.emoji}
      </div>
      <div className="card-body">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p className="muted">
          {item.calories} kcal · P {item.protein}g · C {item.carbs}g · G {item.fat}g
        </p>
        <strong>{formatPrice(item.priceCents)}</strong>
        {orderTo && (
          <div className="row">
            <Link className="btn primary" to={orderTo}>
              Pedir
            </Link>
          </div>
        )}
        {(onEdit || onRemove) && (
          <div className="row">
            {onEdit && (
              <button type="button" className="btn" onClick={onEdit}>
                Editar
              </button>
            )}
            {onRemove && (
              <button type="button" className="btn danger" onClick={onRemove}>
                Remover
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
