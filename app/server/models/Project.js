var mongoose   = require('mongoose');

// define the schema for our admin model
var schema = new mongoose.Schema({
  teamCode: {
    type: String,
    required: true,
    unique: true,
    min: 0,
    max: 140,
  },
  description: {
    type: String,
    required: true,
    min: 0,
    max: 140,
  },
  slackGroup: {
    type: String,
    required: true,
    unique: true,
    min: 0,
    max: 140,
  },
  createdBy: {
    type: String,
    required: true,
    min: 0,
    max: 140,
  },

  lastUpdated: {
    type: Number,
    default: Date.now(),
  },

});

schema.set('toJSON', {
  virtuals: true
});

schema.set('toObject', {
  virtuals: true
});

schema.findOneByTeamCode = function(teamCode){
  return this.findOne({
    teamCode: teamCode.toLowerCase()
  });
};


module.exports = mongoose.model('Project', schema);
