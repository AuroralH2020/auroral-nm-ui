"use strict";
var services = angular.module('VicinityManagerApp.services').
factory('invitationsAPIService', ['$http', 'configuration', function($http, configuration){

  var invitationsAPI = {};

  invitationsAPI.getOne = function(id){
    return $http.get(configuration.apiUrl + '/invitation/' + id );
  };

  // invitationsAPI.getAll = function(){
  //   return $http.get(configuration.apiUrl + '/invitation/');
  // };

  invitationsAPI.postOne = function(data) {
    return $http.post(configuration.apiUrl + '/invitation/', { data } );
  };

  return invitationsAPI;
}]);
