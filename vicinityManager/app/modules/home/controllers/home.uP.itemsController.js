"use strict";
angular.module('VicinityManagerApp.controllers')
/*
Filters the items based on the following rules:
- If it is my company profile I see all the items which belong to me
- If it is other company profile I see all its items which:
  . are flagged as public
  . if I am partner of the company, also items flagged for friends
*/
.controller('uPitemsController',
function ($scope, $window, configuration, commonHelpers, $stateParams, itemsAPIService,  Notification) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.cid = { id: $window.sessionStorage.companyAccountId};
  $scope.uid = $window.sessionStorage.userAccountId;
  $scope.things = [];
  $scope.noItems = false;
  $scope.loaded = false;

  function init(){
    itemsAPIService.getUserItems($stateParams.userAccountId, $scope.offset)
    // itemsAPIService.getUserItems($stateParams.userAccountId, $stateParams.companyAccountId, 'device')
      .then(successCallback)
      .catch(function(err){
        Notification.error("Server error");
      });
  }

  init();

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
      $scope.things.push(response.data.message[i]);
    }
    $scope.noItems = ($scope.things.length === 0);
    $scope.allItemsLoaded = response.data.message.length < 24;
    $scope.loaded = true;
    $scope.loadedPage = true;
  }
});
