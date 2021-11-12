"use strict";
angular.module('VicinityManagerApp.controllers')
/*
Filters the items based on the following rules:
- If it is my company profile I see all the items which belong to me
- If it is other company profile I see all its items which:
  . are flagged as public
  . if I am partner of the company, also items flagged for friends
*/
.controller('cPitemsController',
function ($scope, $window, commonHelpers, $stateParams, itemsAPIService,  Notification, configuration) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.cid = $window.sessionStorage.companyAccountId;
  $scope.devices = [];
  $scope.allItemsLoaded = false;
  $scope.loadedPage = false;
  $scope.loaded = false;
  $scope.offset = 0;

  function init(){
    itemsAPIService.getCompanyItems($stateParams.companyAccountId, $scope.offset)
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
        $scope.devices.push(response.data.message[i]);
    }
    console.log($scope.devices)
    $scope.noItems = ($scope.devices.length === 0);
    $scope.allItemsLoaded = response.data.message.length < 12;
    $scope.loaded = true;
    $scope.loadedPage = true;
  }

  function errorCallback(err){
    console.log(err);
    Notification.error("Problem retrieving devices");
  }

});
