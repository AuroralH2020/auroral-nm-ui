'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('contractAPIService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var contractAPI = {};


  contractAPI.getContracts = function(){
    return $http.get(configuration.apiUrl + '/contracts/');
  };

  contractAPI.getContract = function(ctid){
    return $http.get(configuration.apiUrl + '/contract/' + ctid);
  };

  contractAPI.createContract = function(organisations, termsAndConditions='Test test test', description='Lore'){
    return $http.post(configuration.apiUrl + '/contract/',{organisations, termsAndConditions, description});
  };
  
  contractAPI.acceptContractRequest = function(ctid){
    return $http.post(configuration.apiUrl + '/contract/' + ctid + '/accept');
  };

  contractAPI.rejectContractRequest = function(ctid){
    return $http.post(configuration.apiUrl + '/contract/' + ctid + '/reject');
  };

  contractAPI.updateContract = function(ctid, data){
    return $http.put(configuration.apiUrl + '/contract/' + ctid, data);
  };

  contractAPI.removeOrgFromContract = function(ctid){
    return $http.delete(configuration.apiUrl + '/contract/' + ctid);
  };
  
  contractAPI.getContractItems = function(ctid, offset){
    return $http.get(configuration.apiUrl + '/contract/' + ctid + '/items?' + 'offset=' + offset);
  };

  contractAPI.getContractCompanyItems = function(ctid){
    return $http.get(configuration.apiUrl + '/contract/' + ctid + '/items/company');
  };

  contractAPI.addContractItem = function(ctid, oid){
    return $http.post(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid);
  };

  contractAPI.removeContractItem = function(ctid, oid){
    return $http.delete(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid);
  };
  
  contractAPI.editContractItem = function(ctid, oid, payload){
    return $http.put(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid, payload);
  };
  return contractAPI;
}]);
