import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { CookDataProvider } from './hooks/useCookData';
import CookProfile from './pages/CookProfile';
import Home from './pages/Home';
import ManageMenu from './pages/ManageMenu';
import NewPost from './pages/NewPost';

export default function App() {
  return (
    <CookDataProvider>
      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cozinheiro/publicar" element={<NewPost />} />
          <Route path="/cozinheiro/cardapio" element={<ManageMenu />} />
          <Route path="/cozinheiro/:id" element={<CookProfile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <NavBar />
    </CookDataProvider>
  );
}
