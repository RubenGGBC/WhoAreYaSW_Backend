const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const REQUESTS_PER_SECOND = 10;

async function downloadResource(elem, index, total, outputDir, urlBuilder) {
  const { url, filename } = urlBuilder(elem, index);

  try {
    const res = await fetch(url);

    if (res.status === 200) {
      res.body.pipe(fsSync.createWriteStream(path.join(outputDir, filename)));
      console.log(`[${index + 1}/${total}] ${filename} - OK`);
      return true;
    } else {
      console.log(`[${index + 1}/${total}] ${filename} - Status: ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`[${index + 1}/${total}] ${filename} - Error: ${err.message}`);
    return false;
  }
}

async function downloadResources(inputFile, outputDir, urlBuilder) {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const content = await fs.readFile(inputFile, 'utf8');
    let data;

    if (inputFile.endsWith('.json')) {
      data = JSON.parse(content);
    } else {
      data = content.split('\n').filter(line => line.trim() !== '');
    }

    console.log(`Descargando ${data.length} recursos con throttling (${REQUESTS_PER_SECOND} req/s)...\n`);

    let successCount = 0;
    let errorCount = 0;

    // Procesar en bloques de REQUESTS_PER_SECOND cada segundo
    for (let i = 0; i < data.length; i += REQUESTS_PER_SECOND) {
      const batch = data.slice(i, i + REQUESTS_PER_SECOND);

      console.log(`Bloque ${Math.floor(i/REQUESTS_PER_SECOND) + 1}/${Math.ceil(data.length/REQUESTS_PER_SECOND)}`);

      // Ejecutar todas las peticiones del bloque en paralelo
      const results = await Promise.all(
        batch.map((elem, idx) => downloadResource(elem, i + idx, data.length, outputDir, urlBuilder))
      );

      results.forEach(success => success ? successCount++ : errorCount++);

      // Esperar 1 segundo antes del siguiente bloque
      if (i + REQUESTS_PER_SECOND < data.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\nDescarga completada: ${successCount} éxito, ${errorCount} errores`);

  } catch (err) {
    console.error('Error:', err);
  }
}

const TYPE = process.argv[2] || 'leagues';

(async () => {
  switch (TYPE) {
    case 'leagues':
      await downloadResources(
        path.join(__dirname, '../leagues.txt'),
        path.join(__dirname, '../public/images/leagues/'),
        (elem) => ({
          url: `https://playfootball.games/media/competitions/${elem}.png`,
          filename: `${elem}.png`
        })
      );
      break;

    case 'nations':
      await downloadResources(
        path.join(__dirname, '../nationalities.txt'),
        path.join(__dirname, '../public/images/nations/'),
        (elem) => ({
          url: `https://playfootball.games/media/nations/${encodeURIComponent(elem.toLowerCase())}.svg`,
          filename: `${elem}.svg`
        })
      );
      break;

    case 'teams':
      await downloadResources(
        path.join(__dirname, '../teamIDs.txt'),
        path.join(__dirname, '../public/images/teams/'),
        (elem) => {
          const teamId = elem.trim();
          const directory = teamId % 32;
          return {
            url: `https://cdn.sportmonks.com/images/soccer/teams/${directory}/${teamId}.png`,
            filename: `${teamId}.png`
          };
        }
      );
      break;

    case 'players':
      await downloadResources(
        path.join(__dirname, '../json/fullplayers25.json'),
        path.join(__dirname, '../public/images/players/'),
        (player) => {
          const playerId = player.id;
          const directory = playerId % 32;
          return {
            url: `https://playfootball.games/media/players/${directory}/${playerId}.png`,
            filename: `${playerId}.png`
          };
        }
      );
      break;

    default:
      console.log('Uso: node fetchAll.js [leagues|nations|teams|players]');
  }
})();
