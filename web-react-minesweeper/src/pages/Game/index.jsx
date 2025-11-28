import { Link } from "react-router-dom";

export default function GamePage() {
  return (
    <div style={{ padding: "16px" }}>
      <h1>Play Game</h1>
      <p>Выберите игру:</p>
      <ul>
        <li>
          <Link to="/abakumov-anton">
            Minesweeper (Abakumov Anton)
          </Link>
        </li>
      </ul>
    </div>
  );
}
