import { Routes, Route, Link } from "react-router-dom";
import GamePage from "./pages/Game/index.jsx";
import AbakumovAntonPage from "./pages/AbakumovAnton/index.jsx";


function Home() {
  return (
    <div style={{ padding: "16px" }}>
      <h1>Домашня сторінка</h1>
      <p>
        Перейдіть на сторінку ігор: <Link to="/game">Play Game</Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav
        style={{
          padding: "8px 16px",
          background: "#111827",
          color: "#f9fafb",
          display: "flex",
          gap: "16px",
        }}
      >
        <Link to="/" style={{ color: "#f9fafb", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/game" style={{ color: "#f9fafb", textDecoration: "none" }}>
          Play Game
        </Link>
        <Link
          to="/abakumov-anton"
          style={{ color: "#facc15", textDecoration: "none" }}
        >
          Мій Мінер
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/abakumov-anton" element={<AbakumovAntonPage />} />
      </Routes>
    </div>
  );
}

export default App;
