import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { CookDataProvider } from './hooks/useCookData';
import CookProfile from './pages/CookProfile';
import Discover from './pages/Discover';
import Feed from './pages/Feed';
import Checkout from './pages/Checkout';
import ManageMenu from './pages/ManageMenu';
import NewPost from './pages/NewPost';
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/Orders';
import Payment from './pages/Payment';

export default function App() {
  return (
    <CookDataProvider>
      <main className="app">
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/cozinheiro/publicar" element={<NewPost />} />
          <Route path="/cozinheiro/cardapio" element={<ManageMenu />} />
          <Route path="/cozinheiro/:id/pedido" element={<Checkout />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/pedidos/:id" element={<OrderDetail />} />
          <Route path="/pedidos/:id/pagamento" element={<Payment />} />
          <Route path="/cozinheiro/:id" element={<CookProfile />} />
          <Route path="*" element={<Discover />} />
        </Routes>
      </main>
      <NavBar />
    </CookDataProvider>
  );
}
