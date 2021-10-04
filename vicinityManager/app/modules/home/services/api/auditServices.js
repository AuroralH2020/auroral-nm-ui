'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('auditAPIService', ['$http', 'configuration', function($http, configuration){

  var auditAPI = {};

  auditAPI.getAll = function(id, searchDate) {
    return $http.get(configuration.apiUrl + '/audits/' + id + '?days='+ searchDate);
  };

  return auditAPI;
}]);
