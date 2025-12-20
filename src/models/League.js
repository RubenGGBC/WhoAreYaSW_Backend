const { mongoose } = require('../db/connection');

const leagueSchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true,
    unique: true
  },
  country: String,
  flagUrl: String
});

module.exports = mongoose.model('League', leagueSchema);
