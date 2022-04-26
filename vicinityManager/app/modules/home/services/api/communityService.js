'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('communityService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var communityAPI = {};


  communityAPI.getCommunity = function(commId){
    return $http.get(configuration.apiUrl + '/community/' + commId);
  };

  communityAPI.getAllCommunities = function(type, offset, filter, domain){
    // domains
    let url= '/communities?'
    if(domain && Array.isArray(domain)){
      domain.forEach(d => {
          url+='domain='+d + '&'
      });
    }
    //type
    if(type){
      type = Array.isArray(type)? type : [type]
      type.forEach(d => {
        url+='type='+d + '&'
      });
    }
    //offset
    url+='offset=' + offset
    return $http.get(configuration.apiUrl + url );
  };

  communityAPI.addNodeToCommunity = function(commId, agid){
    return $http.post(configuration.apiUrl + '/community/' + commId + '/node/'+ agid);
  };

  communityAPI.removeNodeFromCommunity = function(commId, agid){
    return $http.delete(configuration.apiUrl + '/community/' + commId + '/node/'+ agid);
  };

  communityAPI.addCommunity = function(communityData){
    return $http.post(configuration.apiUrl + '/community/', communityData);
  };

  // communityAPI.getContract = function(ctid){
  //   return $http.get(configuration.apiUrl + '/contract/' + ctid);
  // };

  // communityAPI.createContract = function(organisations, termsAndConditions='Test test test', description='Lore'){
  //   return $http.post(configuration.apiUrl + '/contract/',{organisations, termsAndConditions, description});
  // };
  
  // communityAPI.acceptContractRequest = function(ctid){
  //   return $http.post(configuration.apiUrl + '/contract/' + ctid + '/accept');
  // };

  // communityAPI.rejectContractRequest = function(ctid){
  //   return $http.post(configuration.apiUrl + '/contract/' + ctid + '/reject');
  // };

  // communityAPI.updateContract = function(ctid, data){
  //   return $http.put(configuration.apiUrl + '/contract/' + ctid, data);
  // };

  // communityAPI.removeOrgFromContract = function(ctid){
  //   return $http.delete(configuration.apiUrl + '/contract/' + ctid);
  // };
  
  // communityAPI.getContractItems = function(ctid, offset){
  //   return $http.get(configuration.apiUrl + '/contract/' + ctid + '/items?' + 'offset=' + offset);
  // };

  // communityAPI.getContractCompanyItems = function(ctid){
  //   return $http.get(configuration.apiUrl + '/contract/' + ctid + '/items/company');
  // };

  // communityAPI.addContractItem = function(ctid, oid){
  //   return $http.post(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid);
  // };

  // communityAPI.removeContractItem = function(ctid, oid){
  //   return $http.delete(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid);
  // };
  
  // communityAPI.editContractItem = function(ctid, oid, payload){
  //   return $http.put(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid, payload);
  // };
  return communityAPI;
}]);
