'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('searchService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var searchAPI = {};

  searchAPI.globalSearch = function(text, type, offset=0){
    let url = '/search/global?'

    if(type){
      type = Array.isArray(type)? type : [type]
      type.forEach(d => {
        url+='type='+d + '&'
      });
    }
    url+='offset=' + offset
    url+='&text=' + text
    return $http.get(configuration.apiUrl + url);
  };
  return searchAPI;
}]);
