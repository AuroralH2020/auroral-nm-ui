'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('userAPIService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var userAPI = {};

  userAPI.editInfoAboutUser = function(id, data) {
    return $http.put(configuration.apiUrl + '/user/' + id, data);
  };

  userAPI.updatePassword = function (id, data) {
    return $http.put(configuration.apiUrl + '/user/password/' + id, data);
  };

  userAPI.getUser = function(id) {
    return $http.get(configuration.apiUrl + '/user/' + id);
  };

  // Fetch all users of a given organisation (Filter based on visibility if it is not my org)
  userAPI.getAll = function(cid) {
    return $http.get(configuration.apiUrl + '/users/' + cid);
  };

  userAPI.deleteUser = function(id) {
    var data = {};
    data.userMail = $window.sessionStorage.username;
    return $http.delete(configuration.apiUrl + '/user/' + id);
  };

  return userAPI;
}]);
