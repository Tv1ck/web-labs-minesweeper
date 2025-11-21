import styles from "./Minesweeper.module.css";

const TEKST_STANU = {
  u_procesi: "Гра триває",
  peremoga: "Перемога! 🎉",
  porazka: "Поразка 💥",
};

export default function StatusBar({
  stanHry,
  sekundy,
  zalyshylosPraporciv,
  naPochatyNovuHru,
}) {
  return (
    <div className={styles.statusBar}>
      <div className={styles.statusItem}>
        <span className={styles.label}>Прапорці:</span>
        <span className={styles.value}>{zalyshylosPraporciv}</span>
      </div>

      <div className={styles.statusItem}>
        <span className={styles.label}>Статус:</span>
        <span className={styles.value}>{TEKST_STANU[stanHry]}</span>
      </div>

      <div className={styles.statusItem}>
        <span className={styles.label}>Час:</span>
        <span className={styles.value}>{sekundy}s</span>
      </div>

      <button className={styles.restartButton} onClick={naPochatyNovuHru}>
        Нова гра
      </button>
    </div>
  );
}
