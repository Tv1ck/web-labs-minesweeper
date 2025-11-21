function stvorytyKlitynku() {
        return {
            yeMina: false,
            kilkistSusidnihMin: 0,
            isOpened: false,
            isFlagged: false
        };
    }

    let poleHry = [];

    const stanHry = {
        shyryna: 0,
        vysota: 0,
        kilkistMin: 0,
        status: 'ne_pochata', 
        vidkrytiBezpechni: 0,         
        zahalnaKilkistBezpechnih: 0   
    };

    let timerId = null;
    let secondsPassed = 0;

    function startTimer() {
        if (timerId !== null) {
            return;
        }
        secondsPassed = 0;
        timerId = setInterval(() => {
            secondsPassed++;
            console.log('Таймер:', secondsPassed, 'секунд(и) від початку гри');
        }, 1000);
    }

    function stopTimer() {
        if (timerId === null) return;
        clearInterval(timerId);
        console.log('Таймер зупинено на', secondsPassed, 'секундах');
        timerId = null;
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

                const vMezhahPolya =
                    ny >= 0 && ny < ryadky &&
                    nx >= 0 && nx < stovptsi;

                if (vMezhahPolya && field[ny][nx].yeMina) {
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

    function vMezhahPolya(row, col) {
        return (
            row >= 0 && row < stanHry.vysota &&
            col >= 0 && col < stanHry.shyryna
        );
    }

    function perevirytyPeremohu() {
        if (stanHry.vidkrytiBezpechni === stanHry.zahalnaKilkistBezpechnih) {
            stanHry.status = 'peremoga';
            console.log('Вітаємо! Перемога!');
            stopTimer();
        }
    }

    function openCell(row, col) {
        if (stanHry.status !== 'u_protsesi') {
            console.log('Гра вже завершена, openCell не виконується. Стан:', stanHry.status);
            return;
        }

        if (!vMezhahPolya(row, col)) return;

        const klitynka = poleHry[row][col];

        if (klitynka.isOpened || klitynka.isFlagged) return;

        if (timerId === null) {
            startTimer();
        }

        klitynka.isOpened = true;

        if (klitynka.yeMina) {
            stanHry.status = 'porazka';
            console.log('Натиснули на міну! ПОРАЗКА.');
            stopTimer();
            console.log('Поточний стан гри:', stanHry);
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

        console.log(`Після openCell(${row}, ${col})`);
        console.log('Поле гри:', poleHry);
        console.log('Стан гри:', stanHry);
    }

    function toggleFlag(row, col) {
        if (stanHry.status !== 'u_protsesi') {
            console.log('Гра вже завершена, прапорці не змінюються.');
            return;
        }

        if (!vMezhahPolya(row, col)) return;

        const klitynka = poleHry[row][col];

        if (klitynka.isOpened) return;

        klitynka.isFlagged = !klitynka.isFlagged;

        console.log(`toggleFlag(${row}, ${col}): isFlagged =`, klitynka.isFlagged);
        console.log('Поле гри:', poleHry);
    }

    function pochatyNovuHru(rows = 10, cols = 10, mines = 10) {
        stopTimer(); 

        stanHry.vysota = rows;
        stanHry.shyryna = cols;
        stanHry.kilkistMin = mines;
        stanHry.status = 'u_protsesi';
        stanHry.vidkrytiBezpechni = 0;
        stanHry.zahalnaKilkistBezpechnih = rows * cols - mines;

        poleHry = generateField(rows, cols, mines);

        console.log('Нова гра. Згенероване поле:', poleHry);
        console.log('Початковий стан гри:', stanHry);
    }

    pochatyNovuHru(10, 10, 10);

    console.log('Мін навколо клітинки (0,0):', countNeighbourMines(poleHry, 0, 0));
    console.log('Мін навколо клітинки (1,1):', countNeighbourMines(poleHry, 1, 1));

    console.log(
        'Для ручної перевірки:\n',
        '- викликайте openCell(row, col)\n',
        '- викликайте toggleFlag(row, col)\n',
        '- викликайте startTimer() та stopTimer() окремо при потребі.'
    );