function stvorytyKlitynku() {
        return {
            yeMina: false,
            kilkistSusidnihMin: 0,
            isOpened: false,
            isFlagged: false
        };
    }

    let poleHry = [];           
    let domKlitynky = [];       

    const stanHry = {
        shyryna: 0,
        vysota: 0,
        kilkistMin: 0,
        status: 'ne_pochata',           
        vidkrytiBezpechni: 0,
        zahalnaKilkistBezpechnih: 0,
        vstanovleniPraportsi: 0,
        minaPidryvRow: null,
        minaPidryvCol: null
    };

    let timerId = null;
    let secondsPassed = 0;

    const timerElement = document.querySelector('[data-timer-value]');
    const flagsElement = document.querySelector('[data-flags-value]');
    const gameFieldElement = document.querySelector('[data-game-field]');
    const newGameButton = document.querySelector('[data-new-game]');
    const newGameButtonText = document.querySelector('[data-new-game-text]');
    const statusElement = document.querySelector('[data-game-status]');

    function onovytyVidobrazhennyaTaimeru() {
        if (!timerElement) return;
        timerElement.textContent = String(secondsPassed).padStart(3, '0');
    }

    function startTimer() {
        if (timerId !== null) return;
        secondsPassed = 0;
        onovytyVidobrazhennyaTaimeru();
        timerId = setInterval(() => {
            secondsPassed++;
            onovytyVidobrazhennyaTaimeru();
        }, 1000);
    }

    function stopTimer() {
        if (timerId === null) return;
        clearInterval(timerId);
        timerId = null;
    }

    function vMezhahPolya(row, col) {
        return (
            row >= 0 && row < stanHry.vysota &&
            col >= 0 && col < stanHry.shyryna
        );
    }

    function countNeighbourMines(field, row, col) {
        const ryadky = field.length;
        const stovptsi = field[0].length;
        let kilkist = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue;
                const ny = row + dy;
                const nx = col + dx;
                const vMezhah =
                    ny >= 0 && ny < ryadky &&
                    nx >= 0 && nx < stovptsi;
                if (vMezhah && field[ny][nx].yeMina) {
                    kilkist++;
                }
            }
        }

        return kilkist;
    }

    function generateField(rows, cols, mines) {
        const field = [];

        for (let y = 0; y < rows; y++) {
            const ryadok = [];
            for (let x = 0; x < cols; x++) {
                ryadok.push(stvorytyKlitynku());
            }
            field.push(ryadok);
        }

        let rozmishchenoMin = 0;
        while (rozmishchenoMin < mines) {
            const randRow = Math.floor(Math.random() * rows);
            const randCol = Math.floor(Math.random() * cols);
            if (!field[randRow][randCol].yeMina) {
                field[randRow][randCol].yeMina = true;
                rozmishchenoMin++;
            }
        }

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                field[y][x].kilkistSusidnihMin = countNeighbourMines(field, y, x);
            }
        }

        return field;
    }

    function perevirytyPeremohu() {
        if (
            stanHry.status === 'u_protsesi' &&
            stanHry.vidkrytiBezpechni === stanHry.zahalnaKilkistBezpechnih
        ) {
            stanHry.status = 'peremoga';
            stopTimer();
            onovytyStatusTekst();
            rozkrytyUsiMiny();
            alert('Перемога! Усі безпечні клітинки відкриті.');
        }
    }

    function rozkrytyUsiMiny() {
        for (let y = 0; y < stanHry.vysota; y++) {
            for (let x = 0; x < stanHry.shyryna; x++) {
                const k = poleHry[y][x];
                if (k.yeMina) {
                    k.isOpened = true;
                }
            }
        }
    }

    function openCell(row, col) {
        if (stanHry.status !== 'u_protsesi') return;
        if (!vMezhahPolya(row, col)) return;

        const klitynka = poleHry[row][col];

        if (klitynka.isOpened || klitynka.isFlagged) return;

        if (timerId === null) {
            startTimer();
        }

        klitynka.isOpened = true;

        if (klitynka.yeMina) {
            stanHry.status = 'porazka';
            stanHry.minaPidryvRow = row;
            stanHry.minaPidryvCol = col;
            stopTimer();
            rozkrytyUsiMiny();
            onovytyStatusTekst();
            alert('Поразка! Ви натиснули на міну.');
            return;
        }

        stanHry.vidkrytiBezpechni++;

        if (klitynka.kilkistSusidnihMin === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dy === 0 && dx === 0) continue;
                    const ny = row + dy;
                    const nx = col + dx;
                    if (vMezhahPolya(ny, nx)) {
                        openCell(ny, nx);
                    }
                }
            }
        }

        perevirytyPeremohu();
    }

    function toggleFlag(row, col) {
        if (stanHry.status !== 'u_protsesi') return;
        if (!vMezhahPolya(row, col)) return;

        const klitynka = poleHry[row][col];

        if (klitynka.isOpened) return;

        if (klitynka.isFlagged) {
            klitynka.isFlagged = false;
            stanHry.vstanovleniPraportsi--;
        } else {
            if (stanHry.vstanovleniPraportsi >= stanHry.kilkistMin) {
                return; 
            }
            klitynka.isFlagged = true;
            stanHry.vstanovleniPraportsi++;
        }

        onovytyLichylkuPraportsiv();
    }

    function onovytyLichylkuPraportsiv() {
        if (!flagsElement) return;
        const dostupni = stanHry.kilkistMin - stanHry.vstanovleniPraportsi;
        flagsElement.textContent = String(dostupni).padStart(3, '0');
    }

    function onovytyStatusTekst() {
        if (!statusElement) return;
        statusElement.classList.remove('status-hry--peremoga', 'status-hry--porazka');

        if (stanHry.status === 'u_protsesi') {
            statusElement.textContent = 'Гра триває';
        } else if (stanHry.status === 'peremoga') {
            statusElement.textContent = 'Перемога!';
            statusElement.classList.add('status-hry--peremoga');
        } else if (stanHry.status === 'porazka') {
            statusElement.textContent = 'Поразка';
            statusElement.classList.add('status-hry--porazka');
        } else {
            statusElement.textContent = 'Натисніть «Старт»';
        }
    }

    function stvorytyDomPole() {
        domKlitynky = [];
        gameFieldElement.innerHTML = '';

        gameFieldElement.style.gridTemplateColumns =
            `repeat(${stanHry.shyryna}, 32px)`;

        for (let y = 0; y < stanHry.vysota; y++) {
            const ryadokDom = [];
            for (let x = 0; x < stanHry.shyryna; x++) {
                const cellEl = document.createElement('div');
                cellEl.classList.add('klityna', 'klityna--zakryta', 'klityna-igrova');
                cellEl.dataset.row = String(y);
                cellEl.dataset.col = String(x);

                cellEl.addEventListener('click', (event) => {
                    const r = Number(event.currentTarget.dataset.row);
                    const c = Number(event.currentTarget.dataset.col);
                    openCell(r, c);
                    vidrenderytyPole();
                    onovytyLichylkuPraportsiv();
                });

                cellEl.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    const r = Number(event.currentTarget.dataset.row);
                    const c = Number(event.currentTarget.dataset.col);
                    toggleFlag(r, c);
                    vidrenderytyPole();
                });

                gameFieldElement.appendChild(cellEl);
                ryadokDom.push(cellEl);
            }
            domKlitynky.push(ryadokDom);
        }
    }

    function vidrenderytyPole() {
        for (let y = 0; y < stanHry.vysota; y++) {
            for (let x = 0; x < stanHry.shyryna; x++) {
                const klitynka = poleHry[y][x];
                const el = domKlitynky[y][x];

                el.textContent = '';
                el.className = 'klityna klityna-igrova';

                if (stanHry.status === 'porazka') {
                    if (klitynka.yeMina) {
                        if (y === stanHry.minaPidryvRow && x === stanHry.minaPidryvCol) {
                            el.classList.add('klityna--mina-aktivna');
                            el.textContent = '💣';
                        } else if (klitynka.isFlagged) {
                            el.classList.add('klityna--prapor-mina');
                            el.textContent = '🚩';
                        } else {
                            el.classList.add('klityna--mina');
                            el.textContent = '💣';
                        }
                    } else {
                        if (klitynka.isFlagged) {
                            el.classList.add('klityna--prapor-pomylka');
                            el.textContent = '🚩';
                        } else if (klitynka.isOpened) {
                            el.classList.add('klityna--vidkryta');
                            if (klitynka.kilkistSusidnihMin > 0) {
                                const span = document.createElement('span');
                                span.classList.add('chyslo', 'chyslo--' + klitynka.kilkistSusidnihMin);
                                span.textContent = String(klitynka.kilkistSusidnihMin);
                                el.appendChild(span);
                            }
                        } else {
                            el.classList.add('klityna--zakryta');
                        }
                    }
                    continue;
                }

                if (!klitynka.isOpened) {
                    if (klitynka.isFlagged) {
                        el.classList.add('klityna--prapor-mina');
                        el.textContent = '🚩';
                    } else {
                        el.classList.add('klityna--zakryta');
                    }
                } else {
                    if (klitynka.yeMina) {
                        el.classList.add('klityna--mina');
                        el.textContent = '💣';
                    } else {
                        el.classList.add('klityna--vidkryta');
                        if (klitynka.kilkistSusidnihMin > 0) {
                            const span = document.createElement('span');
                            span.classList.add('chyslo', 'chyslo--' + klitynka.kilkistSusidnihMin);
                            span.textContent = String(klitynka.kilkistSusidnihMin);
                            el.appendChild(span);
                        }
                    }
                }
            }
        }

        onovytyStatusTekst();
    }

    function pochatyNovuHru(rows = 10, cols = 10, mines = 10) {
        stopTimer();
        secondsPassed = 0;
        onovytyVidobrazhennyaTaimeru();

        stanHry.vysota = rows;
        stanHry.shyryna = cols;
        stanHry.kilkistMin = mines;
        stanHry.status = 'u_protsesi';
        stanHry.vidkrytiBezpechni = 0;
        stanHry.zahalnaKilkistBezpechnih = rows * cols - mines;
        stanHry.vstanovleniPraportsi = 0;
        stanHry.minaPidryvRow = null;
        stanHry.minaPidryvCol = null;

        poleHry = generateField(rows, cols, mines);

        stvorytyDomPole();
        onovytyLichylkuPraportsiv();
        vidrenderytyPole();

        if (newGameButtonText) {
            newGameButtonText.textContent = 'Рестарт';
        }

        console.log('Нова гра. Згенероване поле:', poleHry);
        console.log('Початковий стан гри:', stanHry);
    }

    newGameButton.addEventListener('click', () => {
        pochatyNovuHru(10, 10, 10);
    });

    onovytyVidobrazhennyaTaimeru();
    onovytyLichylkuPraportsiv();
    onovytyStatusTekst();