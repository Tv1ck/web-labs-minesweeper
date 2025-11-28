import Cell from "./Cell";
import styles from "./Minesweeper.module.css";

export default function Board({ pole, onOpenCell, onToggleFlag }) {
  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${pole[0]?.length || 0}, 32px)`,
      }}
    >
      {pole.map((ryadok, rowIndex) =>
        ryadok.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onOpen={() => onOpenCell(rowIndex, colIndex)}
            onToggleFlag={() => onToggleFlag(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
