const fs = require('fs').promises;
const path = require('path');

require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const Pokemon = require('../../models/Pokemon');
const { connectDB, mongoose } = require('../connection');

function capitalizeType(type) {
    if (!type || typeof type !== 'string') return undefined;
    const lower = type.trim().toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

(async () => {
    try {

        console.log('Conectando a MongoDB...');
        await connectDB();

        console.log('Leyendo pokedex...');
        const pokedexPath = path.join(__dirname, '../../../public/json/pokedex-1-1000.json');
        const pokedexContent = await fs.readFile(pokedexPath, 'utf8');
        const pokedexData = JSON.parse(pokedexContent);

        console.log('Limpiando pokémon previos...');
        await Pokemon.deleteMany({});

        console.log(`Preparando ${pokedexData.length} pokémon para insertar...`);

        const pokemonToInsert = pokedexData.map((poke) => {
            const type1 = capitalizeType(poke.type1);
            const type2Cap = capitalizeType(poke.type2) || type1;
            const type2 = type2Cap; // siempre present

            return {
                id: poke.pokemonId,
                name: poke.pokemonName,
                type1,
                type2,
                weight: typeof poke.weight === 'number' ? poke.weight : parseInt(poke.weight, 10) || 0,
                imageUrl: `images/pokemon/${poke.pokemonId}.png`
            };
        });

        await Pokemon.insertMany(pokemonToInsert);

        console.log(`✓ ${pokedexData.length} pokémon insertados exitosamente`);
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error en seeder:', error);
        try {
            if (mongoose.connection?.readyState === 1) await mongoose.connection.close();
        } catch {
            // noop
        }
        process.exit(1);
    }
})();
