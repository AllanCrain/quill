angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'ProjectService',
    'TEAM',
    function($scope, currentUser, settings, Utils, UserService, ProjectService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;


      function updatePage(data){
        $scope.projects = data;
      }

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .then(response => {
            $scope.error = null;
            $scope.teammates = response.data;
          });
      }

      if ($scope.user.teamCode){
        _populateTeammates();
      }

      $scope.joinTeam = function(){
        UserService
          .joinOrCreateTeam($scope.code)
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            _populateTeammates();
          }, response => {
            $scope.error = response.data.message;
          });
      };

      $scope.deleteTeam = function(){
        ProjectService
          .deleteTeam($scope.code);
      };

      $scope.createProject = function(){
        ProjectService
          .create($scope.code, "TODO", $scope.description, $scope.slackGroup)
          .then(response => {
            updatePage(response.data);
            $scope.joinTeam($scope.code);
          }, response => {
            $scope.error = response.data.message;
          });
      };

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            $scope.teammates = [];
          }, response => {
            $scope.error = response.data.message;
          });
      };


      ProjectService
        .getAll()
        .then(response => {
          updatePage(response.data);
        });

      $('.ui.accordion')
        .accordion()
      ;
    }]);
