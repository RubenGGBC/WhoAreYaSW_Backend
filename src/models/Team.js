const { mongoose } = require('../db/connection');

const teamSchema = new mongoose.Schema({
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
  leagueId: {
    type: Number,
    required: true
  },
  logoUrl: String,
  country: String,
  stadium: String
});

module.exports = mongoose.model('Team', teamSchema);
