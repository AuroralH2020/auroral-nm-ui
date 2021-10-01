"use strict";
angular.module('VicinityManagerApp.controllers')
/*
Filters the items based on the following rules:
- If it is my company profile I see all the items which belong to me
- If it is other company profile I see all its items which:
  . are flagged as public
  . if I am partner of the company, also items flagged for friends
*/
.controller('uPservicesController',
function ($scope, $window, commonHelpers, $stateParams, itemsAPIService,  Notification) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.cid = { id: $window.sessionStorage.companyAccountId};
  $scope.uid = $window.sessionStorage.userAccountId;
  $scope.things = [];
  $scope.noItems = false;
  $scope.loaded = false;

  function init(){
    itemsAPIService.getMyItems('Service', $scope.offset)
    // itemsAPIService.getUserItems($stateParams.userAccountId, $stateParams.companyAccountId, 'service')
    .then(successCallback)
    .catch(function(err){
      console.log(err);
      Notification.error("Server error");
    });
  }

  init();

  // Callbacks

  function successCallback(response) {
    for(var i = 0; i < response.data.message.length; i++){
      response.data.message[i].avatar = response.data.message[i].avatar || configuration.avatarItem
      $scope.things.push(response.data.message[i]);
    }
    $scope.noItems = ($scope.things.length === 0);
    $scope.allItemsLoaded = response.data.message.length < 12;
    $scope.loaded = true;
    $scope.loadedPage = true;
  }
});
