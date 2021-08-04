'use strict';
angular.module('VicinityManagerApp.controllers')
.controller('cPfriendsController',
function ($scope, $stateParams, commonHelpers, userAccountAPIService, $window, Notification, configuration) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.friends = [];
  $scope.loaded = false;

  userAccountAPIService.getUserAccounts($stateParams.companyAccountId, 1)
    .then(successCallback)
    .catch(errorCallback);

    function successCallback(response) {
      $scope.friends = response.data.message.map((it) => {
         return {
          avatar: it.avatar || configuration.avatarOrg,
          cid: it.cid,
          name: it.name,
          location: it.location
        }
      });
      $scope.loaded = true;
    }

    function errorCallback(err){
      console.log(err);
      Notification.error("Server error");
    }

  }
);
