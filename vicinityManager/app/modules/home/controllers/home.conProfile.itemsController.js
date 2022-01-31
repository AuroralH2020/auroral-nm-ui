"use strict";
angular.module('VicinityManagerApp.controllers')
/*
Filters the items based on the following rules:
- If it is my company profile I see all the items which belong to me
- If it is other company profile I see all its items which:
  . are flagged as public
  . if I am partner of the company, also items flagged for friends
*/
.controller('conProfileItemsController',
function ($scope, $window, commonHelpers, $stateParams, contractAPIService,  Notification, configuration) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.cid = $window.sessionStorage.companyAccountId;
  $scope.items = [];
  $scope.allItemsLoaded = false;
  $scope.loadedPage = false;
  $scope.loaded = false;
  $scope.offset = 0;

  function init(){
    contractAPIService.getContractItems($stateParams.contractId, $scope.offset)
      .then(successCallback)
      .catch(errorCallback);
  }

  init();

  // Trigers load of more items

  $scope.loadMore = function(){
      $scope.loaded = false;
      $scope.offset += 12;
      init();
  };

  $scope.getBackgroundColor = function(item){
    if (!item.enabled) {
      return 'bg-gray'
    } else {
      if (item.type === 'Service'){
        return 'bg-yellow'
    }
      return 'bg-aqua'
  }
}

  // Callbacks

  function successCallback(response) {
    for(var i = 0; i < response.data.message.length; i++){
        if(response.data.message[i].accessLevel === 2) { 
          response.data.message[i].privacyCaption = 'Public';
        } else if(response.data.message[i].accessLevel === 1) { 
          response.data.message[i].privacyCaption = 'For Friends'; 
        } else { 
          response.data.message[i].privacyCaption = 'Private'; 
        }
        response.data.message[i].avatar = response.data.message[i].avatar || configuration.avatarItem
        $scope.items.push(response.data.message[i]);
    }
    $scope.noItems = ($scope.items.length === 0);
    $scope.allItemsLoaded = response.data.message.length < 12;
    $scope.loaded = true;
    $scope.loadedPage = true;
  }

  function errorCallback(err){
    // console.log(err);
    // Notification.error("Problem retrieving items");
    $scope.noItems = ($scope.items.length === 0);
    $scope.loaded = true;
    $scope.loadedPage = true;
    $scope.allItemsLoaded = true;

  }

});
