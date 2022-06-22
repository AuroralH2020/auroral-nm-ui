'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('api_keysService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var api_keyAPI = {};

  api_keyAPI.getAll = function(cursor) {
    return $http.get(configuration.apiUrl + '/api-keys/');
  };

  api_keyAPI.createApi_key = function(api_key) {
    return $http.post(configuration.apiUrl + '/api-keys/', api_key);
  };

  api_keyAPI.removeApi_key = function(id) {
    return $http.delete(configuration.apiUrl + '/api-keys/' + id );
  };

  return api_keyAPI;

}]);
