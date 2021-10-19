'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('userAccountAPIService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var userAccountAPI = {};

  // Main calls - retrieving userAccounts

  userAccountAPI.getUserAccountProfile = function(id) {
    return $http.get(configuration.apiUrl +'/organisation/' + id);
  };

  userAccountAPI.getUserAccounts = function(id, filter, offset) {
    offset = offset || 0; // defaults to no offset
    filter = filter || 0; // defaults to no organisation filtering
    return $http.get(configuration.apiUrl + '/organisations/' + id + '?type=' + filter + '&offset=' + offset)
  };

  userAccountAPI.updateUserAccounts = function(id,data){
    return $http.put(configuration.apiUrl + '/organisation/' + id, data);
  };

  userAccountAPI.getUserAccounts = function(id, filter, offset){
    return $http.get(configuration.apiUrl + '/organisations/' + id + '?type=' + filter + '&offset=' + offset);
  };

  // Neigbourhood management
    
  userAccountAPI.sendNeighbourRequest = function (id) {
    var data = {};
    data.userMail = $window.sessionStorage.username;
    return $http.post(configuration.apiUrl +'/organisation/' + id + '/friendship/request', data);
  };

  userAccountAPI.acceptNeighbourRequest = function(id) {
    var data = {};
    data.userMail = $window.sessionStorage.username;
    return $http.post(configuration.apiUrl +'/organisation/' + id + '/friendship/accept', data);
  };

  userAccountAPI.rejectNeighbourRequest = function(id) {
    var data = {};
    data.userMail = $window.sessionStorage.username;
    return $http.post(configuration.apiUrl +'/organisation/' + id + '/friendship/reject', data);
  };

  userAccountAPI.cancelNeighbourRequest = function(id) {
    var data = {};
    data.userMail = $window.sessionStorage.username;
    return $http.post(configuration.apiUrl +'/organisation/' + id + '/friendship/cancelRequest', data);
  };

  userAccountAPI.cancelNeighbourship = function(id) {
    var data = {};
    data.userMail = $window.sessionStorage.username;
    return $http.post(configuration.apiUrl +'/organisation/' + id + '/friendship/cancel', data);
  };

  // Configuration endPoints (currently only schemaColor)

  userAccountAPI.getConfigurationParameters = function(id) {
    return $http.get(configuration.apiUrl +'/organisation/' + id + '/configuration');
  };

  userAccountAPI.removeOrganisation = function() {
    return $http.delete(configuration.apiUrl + '/organisation');
  };

  return userAccountAPI;

}]);
