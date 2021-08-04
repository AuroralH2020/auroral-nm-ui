'use strict';
angular.module('VicinityManagerApp.controllers')
.controller('rPregAdminController',
function ($scope, $window, $stateParams, commonHelpers, $location, registrationsAPIService, Notification) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.loaded = false;

    registrationsAPIService.getOne($stateParams.registrationId)
      .then(function(response){
          updateScopeAttributes(response);
          $scope.loaded = true;
        })
        .catch(function(err){
          console.log(err);
          Notification.error("Server error");
        });

    function updateScopeAttributes(response){
        $scope.fullname = response.data.message.name + " " + response.data.message.surname;
        $scope.email = response.data.message.email;
        $scope.occupation = response.data.message.occupation || "Not provided";
    }

});
