angular.module('reg')
  .factory('ProjectService', [
  '$http',
  'Session',
  function($http, Session){

    var users = '/api/teams';
    var base = users + '/';

    return {

      get: function(id){
        return $http.get(base + id);
      },

      getAll: function(){
        return $http.get(base);
      },


      create: function(id, title, description, slackGroup){
        return $http.put(base + id, {
          title,
          description,
          slackGroup
        });
      },
    };
  }
  ]);
