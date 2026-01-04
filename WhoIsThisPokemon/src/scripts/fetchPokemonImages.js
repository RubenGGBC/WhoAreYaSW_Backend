const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const REQUESTS_PER_SECOND = 10;
const DELAY_MS = 1000 / REQUESTS_PER_SECOND;

(async () => {
  try {
    const imagesPath = path.join(__dirname, '../../public/images/pokemon');

    // Crear carpeta si no existe
    await fs.mkdir(imagesPath, { recursive: true });
    console.log('Carpeta de imágenes lista:', imagesPath);

    // Leer archivo pokedex
    const pokedexPath = path.join(__dirname, '../../public/json/pokedex-1-1000.json');
    const pokedexContent = await fs.readFile(pokedexPath, 'utf8');
    const pokemon = JSON.parse(pokedexContent);

    console.log(`Descargando ${pokemon.length} imágenes de pokémon con throttling...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let idx = 0; idx < pokemon.length; idx++) {
      const poke = pokemon[idx];
      const pokemonId = poke.pokemonId;
      const pokemonName = poke.pokemonName;

      // URL de PokeAPI con id de pokémon
      const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

      // Esperar antes de hacer la petición (throttling)
      await new Promise((resolve) => {
        setTimeout(() => {
          fetch(url)
            .then(res => {
              if (res.status === 200) {
                res.body.pipe(fsSync.createWriteStream(path.join(imagesPath, `${pokemonId}.png`)));
                successCount++;
                if ((idx + 1) % 100 === 0) {
                  console.log(`[${idx + 1}/${pokemon.length}] ${pokemonId} - ${pokemonName} ✓`);
                }
              } else {
                errorCount++;
                console.log(`[${idx + 1}/${pokemon.length}] ${pokemonId} - ${pokemonName} ✗ (status: ${res.status})`);
              }
              resolve();
            })
            .catch(err => {
              errorCount++;
              console.log(`[${idx + 1}/${pokemon.length}] ${pokemonId} - ${pokemonName} ✗ Error: ${err.message}`);
              resolve();
            });
        }, idx * DELAY_MS);
      });
    }

    console.log(`\nDescarga completada:`);
    console.log(`✓ ${successCount} imágenes descargadas`);
    console.log(`✗ ${errorCount} errores`);
    console.log(`Total: ${pokemon.length} pokémon`);

  } catch (error) {
    console.error('Error en el proceso de descarga:', error.message);
    process.exit(1);
  }
})();
