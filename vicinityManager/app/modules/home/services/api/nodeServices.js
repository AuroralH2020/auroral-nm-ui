'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('nodeAPIService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var nodeAPI = {};

  nodeAPI.getAll = function() {
    return $http.get(configuration.apiUrl + '/nodes/');
  };

  nodeAPI.getOne = function(id) {
    return $http.get(configuration.apiUrl + '/node/' + id);
  };

  nodeAPI.postOne = function(data) {
    return $http.post(configuration.apiUrl + '/node/', data);
  };

  nodeAPI.updateOne = function(adid,data) {
    return $http.put(configuration.apiUrl + '/node/' + adid, data);
  };

  nodeAPI.removeOne = function(adid) {
    return $http.delete(configuration.apiUrl + '/node/' + adid);
  };

  nodeAPI.getKey = function(id) {
    return $http.get(configuration.apiUrl + '/node/' + id + '/key/');
  };

  nodeAPI.removeKey = function(id) {
    return $http.delete(configuration.apiUrl +'/node/' + id + '/key/');
  };

  // nodeAPI.pullIdFromOrganisation = function(cid,data) {
  //   return $http.put(configuration.apiUrl + '/nodes/node/' + cid, data);
  // };

  return nodeAPI;
}]);
