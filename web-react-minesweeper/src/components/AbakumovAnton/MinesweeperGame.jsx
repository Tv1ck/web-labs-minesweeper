import { useEffect, useState } from "react";
import Board from "./Board";
import StatusBar from "./StatusBar";
import styles from "./Minesweeper.module.css";

const RYADKY = 10;
const STOVPCHYKY = 10;
const KILKIST_MIN = 10;

const STAN_HRY = {
  U_PROCESI: "u_procesi",
  PEREMOGA: "peremoga",
  PORAZKA: "porazka",
};

function stvorytyKlitunku(row, col) {
  return {
    ryadok: row,
    stovpchyk: col,
    yeMina: false,
    vidkryta: false,
    zPraporcem: false,
    kilkistSusidnihMin: 0,
  };
}

function zgeneryuvatyPole(rows, cols, mines) {
  const pole = [];

  for (let y = 0; y < rows; y++) {
    const ryadok = [];
    for (let x = 0; x < cols; x++) {
      ryadok.push(stvorytyKlitunku(y, x));
    }
    pole.push(ryadok);
  }

  let zalyshylosMin = mines;
  while (zalyshylosMin > 0) {
    const randRow = Math.floor(Math.random() * rows);
    const randCol = Math.floor(Math.random() * cols);
    const cell = pole[randRow][randCol];

    if (!cell.yeMina) {
      cell.yeMina = true;
      zalyshylosMin--;
    }
  }

  const napryamky = [
    { dy: -1, dx: -1 },
    { dy: -1, dx: 0 },
    { dy: -1, dx: 1 },
    { dy: 0, dx: -1 },
    { dy: 0, dx: 1 },
    { dy: 1, dx: -1 },
    { dy: 1, dx: 0 },
    { dy: 1, dx: 1 },
  ];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = pole[y][x];
      if (cell.yeMina) continue;

      let kilkist = 0;
      napryamky.forEach(({ dy, dx }) => {
        const ny = y + dy;
        const nx = x + dx;

        const vMezhah =
          ny >= 0 && ny < rows && nx >= 0 && nx < cols;

        if (vMezhah && pole[ny][nx].yeMina) {
          kilkist++;
        }
      });

      cell.kilkistSusidnihMin = kilkist;
    }
  }

  return pole;
}

function perevirytyPeremogu(pole, mines) {
  let vidkrytoBezpechnih = 0;
  let vsehoKlitinok = 0;

  for (const ryadok of pole) {
    for (const cell of ryadok) {
      vsehoKlitinok++;
      if (!cell.yeMina && cell.vidkryta) {
        vidkrytoBezpechnih++;
      }
    }
  }

  return vidkrytoBezpechnih === vsehoKlitinok - mines;
}

export default function MinesweeperGame() {
  const [pole, setPole] = useState(() =>
    zgeneryuvatyPole(RYADKY, STOVPCHYKY, KILKIST_MIN)
  );
  const [stanHry, setStanHry] = useState(STAN_HRY.U_PROCESI);
  const [zalyshylosPraporciv, setZalyshylosPraporciv] =
    useState(KILKIST_MIN);
  const [sekundy, setSekundy] = useState(0);
  const [tajmerZapushcheno, setTajmerZapushcheno] = useState(false);

  useEffect(() => {
    if (!tajmerZapushcheno) return;

    const id = setInterval(() => {
      setSekundy((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [tajmerZapushcheno]);

  function pochatyNovuHru() {
    setPole(zgeneryuvatyPole(RYADKY, STOVPCHYKY, KILKIST_MIN));
    setStanHry(STAN_HRY.U_PROCESI);
    setZalyshylosPraporciv(KILKIST_MIN);
    setSekundy(0);
    setTajmerZapushcheno(false);
  }

  function vidkrytyPorozhniKlitunky(novePole, row, col) {
    const stack = [{ row, col }];

    while (stack.length > 0) {
      const { row: y, col: x } = stack.pop();
      const cell = novePole[y][x];

      if (cell.vidkryta || cell.zPraporcem) continue;

      cell.vidkryta = true;

      if (cell.kilkistSusidnihMin === 0 && !cell.yeMina) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;

            const ny = y + dy;
            const nx = x + dx;

            const vMezhah =
              ny >= 0 && ny < RYADKY &&
              nx >= 0 && nx < STOVPCHYKY;

            if (vMezhah && !novePole[ny][nx].vidkryta) {
              stack.push({ row: ny, col: nx });
            }
          }
        }
      }
    }
  }

  function obrobytyVidkryttyaKlitunky(row, col) {
    if (stanHry !== STAN_HRY.U_PROCESI) return;

    setPole((starePole) => {
      const novePole = starePole.map((ryadok) =>
        ryadok.map((klit) => ({ ...klit }))
      );

      const cell = novePole[row][col];

      if (cell.vidkryta || cell.zPraporcem) {
        return starePole;
      }

      setTajmerZapushcheno(true);

      if (cell.yeMina) {
        for (const ryadok of novePole) {
          for (const k of ryadok) {
            if (k.yeMina) k.vidkryta = true;
          }
        }
        setStanHry(STAN_HRY.PORAZKA);
        setTajmerZapushcheno(false);
        return novePole;
      }

      vidkrytyPorozhniKlitunky(novePole, row, col);

      if (perevirytyPeremogu(novePole, KILKIST_MIN)) {
        setStanHry(STAN_HRY.PEREMOGA);
        setTajmerZapushcheno(false);
      }

      return novePole;
    });
  }

function obrobytyPraporets(row, col) {
  if (stanHry !== STAN_HRY.U_PROCESI) return;

  const targetCell = pole[row][col];

  if (targetCell.vidkryta) return;

  let delta = 0;

  if (targetCell.zPraporcem) {
    delta = +1;
  } else {
    if (zalyshylosPraporciv === 0) return; 
    delta = -1;
  }

  setZalyshylosPraporciv((prev) => prev + delta);

  setPole((starePole) => {
    const novePole = starePole.map((ryadok) =>
      ryadok.map((klit) => ({ ...klit }))
    );

    const cell = novePole[row][col];
    cell.zPraporcem = !cell.zPraporcem;

    return novePole;
  });
}


  return (
    <div className={styles.gameWrapper}>
      <h1 className={styles.gameTitle}>Мінер</h1>

      <StatusBar
        stanHry={stanHry}
        sekundy={sekundy}
        zalyshylosPraporciv={zalyshylosPraporciv}
        naPochatyNovuHru={pochatyNovuHru}
      />

      <Board
        pole={pole}
        onOpenCell={obrobytyVidkryttyaKlitunky}
        onToggleFlag={obrobytyPraporets}
      />
    </div>
  );
}
