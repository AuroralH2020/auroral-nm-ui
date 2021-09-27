"use strict";
var services = angular.module('VicinityManagerApp.services').
factory('registrationsAPIService', ['$http', 'configuration', function($http, configuration){

  var registrationsAPI = {};

  registrationsAPI.getOne = function(id){
    return $http.get(configuration.apiUrl +'/registration/' + id );
  };

  registrationsAPI.getAll = function(){
    return $http.get(configuration.apiUrl +'/registration/');
  };

  registrationsAPI.postOne = function(data) {
    return $http.post(configuration.apiUrl +'/registration/', data);
  };

  registrationsAPI.putOne = function(id, data) {
    return $http.put(configuration.apiUrl +'/registration/' + id, data);
  };

  registrationsAPI.findDuplicatesUser = function(data) {
    return $http.post(configuration.apiUrl +'/registration/duplicatesUser', data);
  };

  registrationsAPI.findDuplicatesCompany = function(data) {
    return $http.post(configuration.apiUrl +'/registration/duplicatesCompany', data);
  };

  return registrationsAPI;
}]);
