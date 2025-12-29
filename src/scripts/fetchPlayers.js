const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../public/images/players/');
const REQUESTS_PER_SECOND = 10;

async function downloadPlayerImage(player, index, total) {
  const playerId = player.id;
  const directory = playerId % 32;
  const url = `https://playfootball.games/media/players/${directory}/${playerId}.png`;

  try {
    const res = await fetch(url);

    if (res.status === 200) {
      res.body.pipe(fsSync.createWriteStream(`${writepath}${playerId}.png`));
      console.log(`[${index + 1}/${total}] ${playerId} - OK`);
      return true;
    } else {
      console.log(`[${index + 1}/${total}] ${playerId} - Status: ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`[${index + 1}/${total}] ${playerId} - Error: ${err.message}`);
    return false;
  }
}

(async () => {
  try {
    await fs.mkdir(writepath, { recursive: true });

    const content = await fs.readFile(path.join(__dirname, '../../public/json/fullplayers25.json'), 'utf8');
    const players = JSON.parse(content);

    console.log(`Descargando ${players.length} imágenes con throttling (${REQUESTS_PER_SECOND} req/s)...\n`);

    let successCount = 0;
    let errorCount = 0;

    // Procesar en bloques de REQUESTS_PER_SECOND cada segundo
    for (let i = 0; i < players.length; i += REQUESTS_PER_SECOND) {
      const batch = players.slice(i, i + REQUESTS_PER_SECOND);

      console.log(`Bloque ${Math.floor(i/REQUESTS_PER_SECOND) + 1}/${Math.ceil(players.length/REQUESTS_PER_SECOND)}`);

      // Ejecutar todas las peticiones del bloque en paralelo
      const results = await Promise.all(
        batch.map((player, idx) => downloadPlayerImage(player, i + idx, players.length))
      );

      results.forEach(success => success ? successCount++ : errorCount++);

      // Esperar 1 segundo antes del siguiente bloque
      if (i + REQUESTS_PER_SECOND < players.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\nDescarga completada: ${successCount} éxito, ${errorCount} errores`);

  } catch (err) {
    console.error(err);
  }
})();
