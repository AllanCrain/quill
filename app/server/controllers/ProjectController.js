var _ = require('underscore');
var Project = require('../models/Project');
var moment = require('moment');

var ProjectController = {};

var maxTeamSize = process.env.TEAM_MAX_SIZE || 4;

ProjectController.createProject = function(teamCode, title, description, slackGroup, callback) {

  if (typeof title !== "string"){
    return callback({
      message: "title must be a string."
    });
  }
  if (typeof teamCode !== "string"){
    return callback({
      message: "teamCode must be a string."
    });
  }
  if (typeof description !== "string"){
    return callback({
      message: "description must be a string."
    });
  }
  if (typeof slackGroup !== "string"){
    return callback({
      message: "slackGroup must be a string."
    });
  }

  var p = new Project();
  p.teamCode = teamCode;
  p.title = title;
  p.description = description;
  p.slackGroup = slackGroup;
  p.save(function(err){
    if (err){
      // Duplicate key error codes
      if (err.name === 'MongoError' && (err.code === 11000 || err.code === 11001)) {
        return callback({
          message: 'This project code already exists.'
        });
      }

      return callback(err);
    } else {
      // yay! success.

      return callback(
        null,
        {
          project: p
        }
      );
    }

  });
};

ProjectController.getByCode = function (teamCode, callback) {
  Project.findOneByTeamCode(teamCode, callback);
};

/**
 * Get all users.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
ProjectController.getAll = function (callback) {
  Project.find({}, callback);
};

module.exports = ProjectController;
