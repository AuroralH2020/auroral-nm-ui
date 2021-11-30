'use strict';
var services = angular.module('VicinityManagerApp.services').
factory('itemsAPIService', ['$http', 'configuration', '$window', function($http, configuration, $window){

  var itemsAPI = {};

  /*
  Modify item
  Delete item
  Get one item
  Get my items (Organisation items) - Offline filter in org profile to remove what I should not see
  Get all items I can see, based on restrictive filter (0 most to 7 less restrictive)
  */
  itemsAPI.getAllItems = function(type, offset, filter) {
    var tempType='type=' + type +'&'
    // types
    if(Array.isArray(type))
    {
      tempType=''
      type.forEach(t => {
        tempType+='type='+t+'&'
      });
    }
    return $http.get(configuration.apiUrl + '/items?' +  tempType + 'offset=' + offset + '&filter=' + filter);
  };

  itemsAPI.getFilteredItems = function(type, offset, filter, domain) {
    var tempType='type=' + type +'&'
    var tempDomain=''
    // types
    if(Array.isArray(type))
    {
      tempType=''
      type.forEach(t => {
        tempType+='type='+t+'&'
      });
    }
    // domains
    if(domain && Array.isArray(domain)){
      domain.forEach(d => {
        tempDomain+='domain='+d+'&'
      });
    }
    const response =  $http.get(configuration.apiUrl + '/items?' +  tempDomain + tempType + 'offset=' + offset + '&filter=' + filter);
    return response
  };

  itemsAPI.getItemWithAdd = function(id){
    return $http.get(configuration.apiUrl + '/items/' + id);
  };

  itemsAPI.putOne = function(oid, data) {
    return $http.put(configuration.apiUrl +'/items/' + oid, data);
  };

  itemsAPI.deleteItem = function(id) {
    return $http.delete(configuration.apiUrl + '/items/' + id);
  };

  itemsAPI.getMyItems = function(type, offset) {
    return $http.get(configuration.apiUrl + '/items?type=' + type + '&offset=' + offset + '&filter=4');
  };

  itemsAPI.getCompanyItems = function(cid, offset) {
    return $http.get(configuration.apiUrl + '/items/company/' + cid + '?type=Device&type=Service' + '&offset=' + offset);
  };

  itemsAPI.getUserItems = function(uid, offset) {
    return $http.get(configuration.apiUrl + '/items/user/' + uid + '?type=Device&type=Service' + '&offset=' + offset);
  };

  itemsAPI.getArrayOfItems = function(items){
    return $http.post(configuration.apiUrl + '/items/array', items);
  };
  /*
  Count
  */

  itemsAPI.itemsCount = function(type){
    return $http.get(configuration.apiUrl + '/items/count/' + type);
  };

  // /*
  // Contract management
  // */

  // itemsAPI.getContracts = function(){
  //   return $http.get(configuration.apiUrl + '/contracts/');
  // };

  // itemsAPI.getContract = function(ctid){
  //   return $http.get(configuration.apiUrl + '/contract/' + ctid);
  // };
  
  // itemsAPI.acceptContractRequest = function(ctid){
  //   return $http.post(configuration.apiUrl + '/contract/' + ctid + '/accept');
  // };

  // itemsAPI.rejectContractRequest = function(ctid){
  //   return $http.post(configuration.apiUrl + '/contract/' + ctid + '/reject');
  // };

  // itemsAPI.removeOrgFromContract = function(ctid){
  //   return $http.delete(configuration.apiUrl + '/contract/' + ctid);
  // };
  
  // itemsAPI.getContractItems = function(ctid, offset){
  //   return $http.get(configuration.apiUrl + '/contract/' + ctid + '/items?' + 'offset=' + offset);
  // };

  // itemsAPI.getContractCompanyItems = function(ctid){
  //   return $http.get(configuration.apiUrl + '/contract/' + ctid + '/items/company');
  // };

  // itemsAPI.addContractItem = function(ctid, oid){
  //   return $http.post(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid);
  // };

  // itemsAPI.removeContractItem = function(ctid, oid){
  //   return $http.delete(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid);
  // };
  
  // itemsAPI.editContractItem = function(ctid, oid, payload){
  //   return $http.put(configuration.apiUrl + '/contract/' + ctid + '/item/' + oid, payload);
  // };

  /*
  Infrastructure
  */
  itemsAPI.getMoveUsers = function(type){
    return $http.get(configuration.apiUrl + '/infrastructure/users?type=' + type);
  };

  itemsAPI.getMoveGateways = function(type){
    return $http.get(configuration.apiUrl + '/infrastructure/gateways?type=' + type);
  };

  itemsAPI.changeGateway = function(payload){
    return $http.put(configuration.apiUrl + '/infrastructure/changeGateway', payload);
  };

  itemsAPI.moveItem = function(payload){
    return $http.put(configuration.apiUrl + '/infrastructure/moveItem', payload);
  };

  return itemsAPI;

}]);
