import styles from "./Minesweeper.module.css";

export default function Cell({ cell, onOpen, onToggleFlag }) {
  let classNames = [styles.cell];

  if (cell.vidkryta) {
    classNames.push(styles.cellOpen);
    if (cell.yeMina) {
      classNames.push(styles.cellMine);
    }
  } else {
    classNames.push(styles.cellClosed);
    if (cell.zPraporcem) {
      classNames.push(styles.cellFlag);
    }
  }

  const kontent =
    cell.vidkryta && !cell.yeMina && cell.kilkistSusidnihMin > 0
      ? cell.kilkistSusidnihMin
      : "";

  const handleClick = () => {
    onOpen(); 
  };

  const handleRightClick = (e) => {
    e.preventDefault(); 
    onToggleFlag();     
  };

  return (
    <button
      className={classNames.join(" ")}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {cell.yeMina && cell.vidkryta ? "💣" : null}
      {!cell.yeMina && kontent}
      {!cell.vidkryta && cell.zPraporcem ? "🚩" : null}
    </button>
  );
}
