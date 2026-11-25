import { NavLink } from 'react-router-dom';
import { CURRENT_COOK_ID } from '../data/mock';

export default function NavBar() {
  return (
    <nav className="navbar" aria-label="Navegação principal">
      <NavLink to="/" end>
        Descobrir
      </NavLink>
      <NavLink to="/feed">Feed</NavLink>
      <NavLink to="/pedidos">Pedidos</NavLink>
      <NavLink to={`/cozinheiro/${CURRENT_COOK_ID}`}>Meu perfil</NavLink>
      <NavLink to="/cozinheiro/publicar">Publicar</NavLink>
      <NavLink to="/cozinheiro/cardapio">Cardápio</NavLink>
    </nav>
  );
}
