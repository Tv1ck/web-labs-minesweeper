function stvorytyKlitynku(yeMina = false, kilkistSusidnihMin = 0, stan = 'zakryta') {
            return {
                yeMina: yeMina,

                kilkistSusidnihMin: kilkistSusidnihMin,

                stan: stan
            };
        }

        const kilkistRyadkiv = 10;    
        const kilkistStovptsiv = 10;   

        function stvorytyPustePole(ryadky, stovptsi) {
            const pole = [];

            for (let y = 0; y < ryadky; y++) {
                const ryadok = [];

                for (let x = 0; x < stovptsi; x++) {
                    ryadok.push(stvorytyKlitynku(false, 0, 'zakryta'));
                }

                pole.push(ryadok);
            }

            return pole;
        }

        let poleHry = stvorytyPustePole(kilkistRyadkiv, kilkistStovptsiv);

        const stanHry = {
            shyryna: kilkistStovptsiv,
            vysota: kilkistRyadkiv,
            kilkistMin: 0,          
            status: 'u_protsesi'    
        };

        function rozmistytyTestoviMiny(pole) {
            const koordinatyMin = [
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 2 },
                { x: 1, y: 4 },
                { x: 6, y: 5 }
            ];

            koordinatyMin.forEach(({ x, y }) => {
                pole[y][x].yeMina = true;
            });

            stanHry.kilkistMin = koordinatyMin.length;
        }

        function onovytyLichylnykyMin(pole) {
            const ryadky = pole.length;
            const stovptsi = pole[0].length;

            const napryamky = [
                { dy: -1, dx: -1 },
                { dy: -1, dx:  0 },
                { dy: -1, dx:  1 },
                { dy:  0, dx: -1 },
                { dy:  0, dx:  1 },
                { dy:  1, dx: -1 },
                { dy:  1, dx:  0 },
                { dy:  1, dx:  1 }
            ];

            for (let y = 0; y < ryadky; y++) {
                for (let x = 0; x < stovptsi; x++) {
                    let kilkist = 0;

                    napryamky.forEach(({ dy, dx }) => {
                        const ny = y + dy;
                        const nx = x + dx;

                        const vMezhahPolya =
                            ny >= 0 && ny < ryadky &&
                            nx >= 0 && nx < stovptsi;

                        if (vMezhahPolya && pole[ny][nx].yeMina) {
                            kilkist++;
                        }
                    });

                    pole[y][x].kilkistSusidnihMin = kilkist;
                }
            }
        }

        rozmistytyTestoviMiny(poleHry);
        onovytyLichylnykyMin(poleHry);

        console.log('Поле гри (двовимірний масив):', poleHry);
        console.log('Стан гри:', stanHry);