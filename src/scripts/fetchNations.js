const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../public/images/nations/');

(async () => {
  try {
    await fs.mkdir(writepath, { recursive: true });

    const content = await fs.readFile(path.join(__dirname, '../../nationalities.txt'), 'utf8');
    const data = content.split('\n');

    data.forEach((elem, idx) => {
      const cleanElem = elem.trim();
      if (!cleanElem) return;
      
      const encodedNation = encodeURIComponent(cleanElem);
      const url = `https://playfootball.games/media/nations/${encodedNation}.svg`;
      
      fetch(url)
        .then(res => {
          if (res.status === 200) {
            res.body.pipe(fsSync.createWriteStream(`${writepath}${cleanElem}.svg`));
            console.log(`[${idx + 1}] ${cleanElem}`);
          } else {
            console.log(`[${idx + 1}] status: ${res.status} - ${cleanElem}`);
          }
        })
        .catch(err => console.log(err));
    });
  } catch (err) {
    console.error(err);
  }
})();
