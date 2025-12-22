const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  gameNumber: {
    type: Number,
    required: true,
    unique: true
  },
  playerId: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Solution', SolutionSchema);