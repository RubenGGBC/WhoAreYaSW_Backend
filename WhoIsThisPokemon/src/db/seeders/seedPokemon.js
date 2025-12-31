const fs = require('fs').promises;
const path = require('path');
const Pokemon = require('../../models/Pokemon');
const { mongoose } = require('../connection');

const POKEMON_TYPES = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
    'Dragon', 'Dark', 'Steel', 'Fairy'
];

(async () => {
    try {
        console.log('Leyendo pokedex...');
        const pokedexPath = path.join(__dirname, '../../../json/pokedex-1-1000.json');
        const pokedexContent = await fs.readFile(pokedexPath, 'utf8');
        const pokedexData = JSON.parse(pokedexContent);

        console.log(`Preparando ${pokedexData.length} pokémon para insertar...`);

        const pokemonToInsert = pokedexData.map((poke) => ({
            id: poke.pokemonId,
            name: poke.pokemonName,
            type1: POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)],
            imageUrl: `images/pokemon/${poke.pokemonId}.png`
        }));

        await Pokemon.insertMany(pokemonToInsert);

        console.log(`✓ ${pokedexData.length} pokémon insertados exitosamente`);
        process.exit(0);
    } catch (error) {
        console.error('Error en seeder:', error.message);
        process.exit(1);
    }
})()
