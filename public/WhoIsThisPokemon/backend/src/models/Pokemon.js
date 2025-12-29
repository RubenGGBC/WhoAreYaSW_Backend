const { mongoose } = require('../db/connection');

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        unique: true
    },
    type1: {
        type: String,
        required: true,
        enum: [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
            'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
            'Dragon', 'Dark', 'Steel', 'Fairy'
        ]
    },
    type2: {
        type: String,
        required: false,
        enum: [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
            'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
            'Dragon', 'Dark', 'Steel', 'Fairy'
        ]
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Pokemon', pokemonSchema);
