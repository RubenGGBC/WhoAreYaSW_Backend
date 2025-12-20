const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../public/images/leagues/');

(async () => {
  try {
    await fs.mkdir(writepath, { recursive: true });

    const content = await fs.readFile(path.join(__dirname, '../../leagues.txt'), 'utf8');
    const data = content.split('\n');

    data.forEach((elem, idx) => {
      const url = `https://playfootball.games/media/competitions/${elem}.png`;
      fetch(url)
        .then(res => {
          if (res.status === 200) {
            res.body.pipe(fsSync.createWriteStream(`${writepath}${elem}.png`));
          } else {
            console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`);
          }
        })
        .catch(err => console.log(err));
    });
  } catch (err) {
    console.error(err);
  }
})();
