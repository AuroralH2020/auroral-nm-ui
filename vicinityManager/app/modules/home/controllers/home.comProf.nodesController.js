"use strict";
angular.module('VicinityManagerApp.controllers')
/*
Filters the items based on the following rules:
- If it is my company profile I see all the items which belong to me
- If it is other company profile I see all its items which:
  . are flagged as public
  . if I am partner of the company, also items flagged for friends
*/
.controller('comProfNodesController',
function ($scope, $window, commonHelpers, $stateParams, communityService,  Notification, configuration) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.cid = $window.sessionStorage.companyAccountId;
  $scope.nodes = [];
  $scope.allItemsLoaded = false;
  $scope.loadedPage = false;
  $scope.loaded = false;
  // $scope.offset = 0;

  function init(){
    communityService.getCommunity($stateParams.commId)
      .then(successCallback)
      .catch(errorCallback);
  }

  init();

  $scope.getBackgroundColor = function(node){
    return 'bg-blue'
    // if (!item.enabled) {
    //   return 'bg-gray'
    // } else {
    //   if (item.type === 'Service'){
    //     return 'bg-yellow'
    // }
    //   return 'bg-aqua'
  // }
  }

  // Callbacks
  function successCallback(response) {
   response.data.message.organisations.forEach(org => {
     org.nodes.forEach(node => {
     $scope.nodes.push({agid: node, org: org.cid, name: org.name})
     });
     
   });
    $scope.noNodes = ($scope.nodes.length === 0);
    $scope.allItemsLoaded = true
    $scope.loaded = true;
    $scope.loadedPage = true;
  }

  function errorCallback(err){
    // console.log(err);
    // Notification.error("Problem retrieving items");
    $scope.noItems = ($scope.nodes.length === 0);
    $scope.loaded = true;
    $scope.loadedPage = true;
    $scope.allItemsLoaded = true;
  }
});
