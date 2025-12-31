const { mongoose } = require('../db/connection');

const pokemonSolutionSchema = new mongoose.Schema({
    gameNumber: {
        type: Number,
        required: true,
        unique: true
    },
    pokemonId: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('PokemonSolution', pokemonSolutionSchema);
