import MinesweeperGame from "../../components/AbakumovAnton/MinesweeperGame";
import styles from "../../components/AbakumovAnton/Minesweeper.module.css";

export default function AbakumovAntonPage() {
  return (
    <div className={styles.page}>
      <MinesweeperGame />
    </div>
  );
}