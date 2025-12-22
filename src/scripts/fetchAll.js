const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const REQUESTS_PER_SECOND = 10;
const DELAY_MS = 1000 / REQUESTS_PER_SECOND;

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

    console.log(`Descargando ${data.length} recursos...\n`);

    for (let idx = 0; idx < data.length; idx++) {
      const elem = data[idx];
      const { url, filename } = urlBuilder(elem, idx);

      await new Promise((resolve) => {
        setTimeout(() => {
          fetch(url)
            .then(res => {
              if (res.status === 200) {
                res.body.pipe(fsSync.createWriteStream(path.join(outputDir, filename)));
                console.log(`[${idx + 1}/${data.length}] ${filename}`);
              } else {
                console.log(`[${idx + 1}/${data.length}] ${filename} - status: ${res.status}`);
              }
              resolve();
            })
            .catch(err => {
              console.log(`[${idx + 1}/${data.length}] ${filename} - ${err.message}`);
              resolve();
            });
        }, idx * DELAY_MS);
      });
    }

    console.log(`\n Descarga completada`);

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
