"use strict";
angular.module('VicinityManagerApp.controllers')
/*
Filters the items based on the following rules:
- If it is my company profile I see all the items which belong to me
- If it is other company profile I see all its items which:
  . are flagged as public
  . if I am partner of the company, also items flagged for friends
*/
.controller('comProfEditController',
function ($scope, $window, commonHelpers, $stateParams, $state, communityService, nodeAPIService,  Notification, configuration) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.cid = $window.sessionStorage.companyAccountId;
  $scope.commId = $stateParams.commId;
  $scope.community = $scope.$parent.community
  $scope.nodes = [];
  $scope.allItemsLoaded = false;
  $scope.loadedPage = false;
  $scope.loaded = false;
  // $scope.offset = 0;

  function init(){
    communityService.getCommunity($scope.commId)
    .then(communityCallback)
    .catch(errorCallback)
    nodeAPIService.getAll()
    .then(nodeCallback)
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
  $scope.shareNode = async function(agid, share) {
    if(share){
      communityService.addNodeToCommunity($scope.commId, agid).then(
        (response) => {
          if(response.status===201) {
            Notification.success("Community updated");
            
          } else {
            Notification.error('Error: ' + response.data.message.error);
          }
          init()
          $scope.$parent.$broadcast("communityChanged");

        }
      ).catch((err)=>{
        Notification.error('Error adding node to community ');
        console.log(err)
      })
    } else {
      // unshare
      communityService.removeNodeFromCommunity($scope.commId, agid).then(
        (response) => {
          if(response.status === 200) {
            Notification.success("Community updated");
          } else {
            Notification.error('Error: ' + response.data.message.error);
          }
          const nodesNum = $scope.community.organisations.map((org) => org.nodes.length).reduce((a, b) => a + b)
          if(nodesNum === 1 ) {
            // last was removed -> move to communities view
            $state.go("root.main.allCommunities");
            Notification.success('All nodes removed')
          } else {
            init()
            $scope.$parent.$broadcast("communityChanged");
          }
        }
      ).catch((err)=>{
        console.log(err)
      })
    }
  }

  // Callbacks
  function nodeCallback(response) {
    $scope.nodes = response.data.message
    $scope.noNodes = ($scope.nodes.length === 0);
    $scope.allItemsLoaded = true
    $scope.loaded = true;
    $scope.loadedPage = true;
  }

  function communityCallback(response) {
    $scope.community = response.data.message
  }
  
  function errorCallback(err){
    Notification.error("Problem retrieving nodes");
    $scope.noItems = ($scope.nodes.length === 0);
    $scope.loaded = true;
    $scope.loadedPage = true;
    $scope.allItemsLoaded = true;
  }
});
