import { Route, Routes } from 'react-router-dom';

function Home() {
  return (
    <main className="app">
      <h1>FitMatch</h1>
      <p>Plataforma de cozinheiros de comida fitness. Esqueleto inicial.</p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
