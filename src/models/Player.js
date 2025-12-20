const { mongoose } = require('../db/connection');

const playerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  birthDate: Date,
  nationality: String,
  teamId: Number,
  leagueId: Number,
  position: {
    type: String,
    enum: ['DF', 'MF', 'FW', 'GK'],
    required: true
  },
  number: Number,
  imageUrl: String
});

module.exports = mongoose.model('Player', playerSchema);
