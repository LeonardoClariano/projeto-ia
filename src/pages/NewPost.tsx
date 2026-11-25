import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRENT_COOK_ID } from '../data/mock';
import { useCookData } from '../hooks/useCookData';

const EMOJIS = ['🍱', '🥗', '🍗', '🍣', '🥩', '🥑', '🍲', '💪'];

export default function NewPost() {
  const { menuItems, addPost } = useCookData();
  const navigate = useNavigate();
  const myMenu = menuItems.filter((m) => m.cookId === CURRENT_COOK_ID);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [menuItemId, setMenuItemId] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [error, setError] = useState('');
  const published = useRef(false);

  useEffect(() => {
    return () => {
      if (imageUrl && !published.current) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageUrl(file ? URL.createObjectURL(file) : undefined);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Informe título e descrição.');
      return;
    }
    addPost(CURRENT_COOK_ID, {
      title: title.trim(),
      description: description.trim(),
      emoji,
      imageUrl,
      menuItemId: menuItemId || undefined,
    });
    // a URL precisa continuar válida para a publicação: não revogar
    published.current = true;
    navigate(`/cozinheiro/${CURRENT_COOK_ID}`);
  }

  return (
    <>
      <h1>Nova publicação</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
        </label>
        <label>
          Descrição
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
          />
        </label>
        <label>
          Foto (opcional)
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
        {imageUrl && <img className="preview" src={imageUrl} alt="Pré-visualização" />}
        {!imageUrl && (
          <fieldset>
            <legend>Ícone de capa</legend>
            <div className="row wrap">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  className={`btn emoji-opt${em === emoji ? ' active' : ''}`}
                  aria-pressed={em === emoji}
                  onClick={() => setEmoji(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <label>
          Prato do cardápio (opcional)
          <select value={menuItemId} onChange={(e) => setMenuItemId(e.target.value)}>
            <option value="">Nenhum</option>
            {myMenu.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button type="submit" className="btn primary">
          Publicar
        </button>
      </form>
    </>
  );
}
