import { useState, type FormEvent } from 'react';
import MenuItemCard from '../components/MenuItemCard';
import { CURRENT_COOK_ID } from '../data/mock';
import { useCookData, type MenuItemInput } from '../hooks/useCookData';

interface FormState {
  name: string;
  description: string;
  price: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  emoji: string;
}

const EMPTY: FormState = {
  name: '',
  description: '',
  price: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  emoji: '🍱',
};

export default function ManageMenu() {
  const { menuItems, addMenuItem, updateMenuItem, removeMenuItem } = useCookData();
  const mine = menuItems.filter((m) => m.cookId === CURRENT_COOK_ID);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState('');

  const set = (key: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function startEdit(id: string) {
    const m = mine.find((x) => x.id === id);
    if (!m) return;
    setEditingId(id);
    setError('');
    setForm({
      name: m.name,
      description: m.description,
      price: (m.priceCents / 100).toFixed(2),
      calories: String(m.calories),
      protein: String(m.protein),
      carbs: String(m.carbs),
      fat: String(m.fat),
      emoji: m.emoji,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY);
    setError('');
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const price = Number(form.price.replace(',', '.'));
    const nums = [form.calories, form.protein, form.carbs, form.fat].map((v) => Number(v || 0));
    if (!form.name.trim() || !(price > 0)) {
      setError('Informe o nome e um preço maior que zero.');
      return;
    }
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) {
      setError('Valores nutricionais devem ser números positivos.');
      return;
    }
    const data: MenuItemInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      priceCents: Math.round(price * 100),
      calories: nums[0],
      protein: nums[1],
      carbs: nums[2],
      fat: nums[3],
      emoji: form.emoji.trim() || '🍱',
    };
    if (editingId) updateMenuItem(editingId, data);
    else addMenuItem(CURRENT_COOK_ID, data);
    reset();
  }

  return (
    <>
      <h1>Meu cardápio</h1>
      <form className="form" onSubmit={onSubmit}>
        <h2>{editingId ? 'Editar prato' : 'Novo prato'}</h2>
        <label>
          Nome
          <input value={form.name} onChange={set('name')} maxLength={80} />
        </label>
        <label>
          Descrição
          <textarea rows={3} value={form.description} onChange={set('description')} />
        </label>
        <div className="grid2">
          <label>
            Preço (R$)
            <input inputMode="decimal" value={form.price} onChange={set('price')} />
          </label>
          <label>
            Ícone
            <input value={form.emoji} onChange={set('emoji')} maxLength={4} />
          </label>
          <label>
            Calorias (kcal)
            <input inputMode="numeric" value={form.calories} onChange={set('calories')} />
          </label>
          <label>
            Proteína (g)
            <input inputMode="numeric" value={form.protein} onChange={set('protein')} />
          </label>
          <label>
            Carboidratos (g)
            <input inputMode="numeric" value={form.carbs} onChange={set('carbs')} />
          </label>
          <label>
            Gorduras (g)
            <input inputMode="numeric" value={form.fat} onChange={set('fat')} />
          </label>
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="row">
          <button type="submit" className="btn primary">
            {editingId ? 'Salvar alterações' : 'Adicionar ao cardápio'}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <section className="list">
        {mine.length === 0 && <p className="muted">Nenhum prato cadastrado.</p>}
        {mine.map((m) => (
          <MenuItemCard
            key={m.id}
            item={m}
            onEdit={() => startEdit(m.id)}
            onRemove={() => {
              if (editingId === m.id) reset();
              removeMenuItem(m.id);
            }}
          />
        ))}
      </section>
    </>
  );
}
