var _ = require('underscore');
var Project = require('../models/Project');
var moment = require('moment');
var User = require('../models/User');

var ProjectController = {};

var maxTeamSize = process.env.TEAM_MAX_SIZE || 3;

ProjectController.createProject = function(teamCode, description, slackGroup, createdBy, callback) {
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
  if (typeof createdBy !== "string"){
    return callback({
      message: "slackGroup must be a string."
    });
  }

  var p = new Project();
  p.teamCode = teamCode;
  p.description = description;
  p.slackGroup = slackGroup;
  p.createdBy = createdBy;
  p.save(function(err){
    if (err){
      // Duplicate key error codes
      if (err.name === 'MongoError' && (err.code === 11000 || err.code === 11001)) {
        console.log(err);
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
 * Get all projects.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
ProjectController.getAll = function (callback) {
  Project.find({})
  .exec(function(err, projects) {
    User.find({})
      .exec(function(err, users) {
        console.log(projects);

        const projectsAndMembers = projects.map((project) => {
          const members = users.filter((user) => {
            return user.teamCode == project.teamCode;
          }).map((user) => {
            return user.profile.name;
          });
          let projectWithMembers = JSON.parse(JSON.stringify(project));
          projectWithMembers.members = members;
          return projectWithMembers;
        });
        return callback(
          null,
          projectsAndMembers
        );

      });
    }
  );
};


ProjectController.delete = function (teamCode, callback) {
  Project.deleteOne({
    teamCode: teamCode
  }, callback);
};

module.exports = ProjectController;
