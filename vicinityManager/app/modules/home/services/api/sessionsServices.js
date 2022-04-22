'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('sessionsService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var sessionAPI = {};

  sessionAPI.getAllSessions = function(cursor) {
    return $http.get(configuration.apiUrl + '/sessions/all/' + cursor );
  };

  sessionAPI.getSession = function(uid) {
    return $http.get(configuration.apiUrl + '/sessions/' + uid );
  };

  sessionAPI.removeSession = function(uid) {
    return $http.delete(configuration.apiUrl + '/sessions/' + uid );
  };

  return sessionAPI;

}]);
