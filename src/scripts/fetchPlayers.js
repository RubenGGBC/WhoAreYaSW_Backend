const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../public/images/players/');
const REQUESTS_PER_SECOND = 10;
const DELAY_MS = 1000 / REQUESTS_PER_SECOND;

(async () => {
  try {
    await fs.mkdir(writepath, { recursive: true });

    const content = await fs.readFile(path.join(__dirname, '../../public/json/fullplayers25.json'), 'utf8');
    const players = JSON.parse(content);

    console.log(`Descargando ${players.length} imágenes de jugadores con throttling...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let idx = 0; idx < players.length; idx++) {
      const player = players[idx];
      const playerId = player.id;
      const directory = playerId % 32;
      const url = `https://playfootball.games/media/players/${directory}/${playerId}.png`;
      
      await new Promise((resolve) => {
        setTimeout(() => {
          fetch(url)
            .then(res => {
              if (res.status === 200) {
                res.body.pipe(fsSync.createWriteStream(`${writepath}${playerId}.png`));
                successCount++;
              } else {
                errorCount++;
              }
              console.log(`[${idx + 1}/${players.length}] ${playerId}`);
              resolve();
            })
            .catch(err => {
              console.log(`Error: ${playerId} - ${err.message}`);
              errorCount++;
              resolve();
            });
        }, idx * DELAY_MS);
      });
    }

    console.log(`\n Descarga completada: ${successCount} éxito, ${errorCount} errores`);

  } catch (err) {
    console.error(err);
  }
})();
