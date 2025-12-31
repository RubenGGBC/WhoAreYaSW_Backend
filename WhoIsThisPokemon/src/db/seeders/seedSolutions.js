const PokemonSolution = require('../../models/PokemonSolution');
const { mongoose } = require('../connection');

const POKEMON_SOLUTION_START_DATE = process.env.POKEMON_SOLUTION_START_DATE || '2025-01-10';

(async () => {
    try {
        console.log('Limpiando soluciones previas...');
        await PokemonSolution.deleteMany({});

        const startDate = new Date(POKEMON_SOLUTION_START_DATE);
        const daysToCreate = 365;
        const solutions = [];

        console.log(`Creando ${daysToCreate} soluciones a partir de ${startDate.toDateString()}...`);

        for (let i = 0; i < daysToCreate; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);

            solutions.push({
                gameNumber: i + 1,
                pokemonId: Math.floor(Math.random() * 1000) + 1,
                date: currentDate
            });
        }

        await PokemonSolution.insertMany(solutions);

        console.log(`✓ ${daysToCreate} soluciones creadas exitosamente`);
        process.exit(0);
    } catch (error) {
        console.error('Error en seeder:', error.message);
        process.exit(1);
    }
})()
