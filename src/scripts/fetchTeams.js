const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../public/images/teams/');

(async () => {
  try {
    await fs.mkdir(writepath, { recursive: true });

    const content = await fs.readFile(path.join(__dirname, '../../teamIDs.txt'), 'utf8');
    const data = content.split('\n');

    data.forEach((elem, idx) => {
      const teamId = elem.trim();
      if (!teamId) return;
      
      const directory = teamId % 32;
      const url = `https://cdn.sportmonks.com/images/soccer/teams/${directory}/${teamId}.png`;
      
      fetch(url)
        .then(res => {
          if (res.status === 200) {
            res.body.pipe(fsSync.createWriteStream(`${writepath}${teamId}.png`));
          } else {
            console.log(`status: ${res.status} line: ${idx} elem: ${teamId} not found`);
          }
        })
        .catch(err => console.log(err));
    });
  } catch (err) {
    console.error(err);
  }
})();
