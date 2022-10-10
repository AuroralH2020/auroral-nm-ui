'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('allRegistrationsController',
  function ($scope,
            commonHelpers,
            $window,
            registrationsAPIService,
            notificationsAPIService,
            Notification) {

// Initialize variables and get initial resources

// ====== Triggers window resize to avoid bug =======
    commonHelpers.triggerResize();

    $scope.loadedPage = false;
    $scope.regisList = [];
    $scope.rev = false;
    $scope.myOrderBy = '-date';
    $scope.allItemsLoaded = false;
    $scope.offset = 0


    init();

    
    function init(){
      registrationsAPIService.getAllCompany($scope.offset)
      .then(function(response){
        response.data.message.forEach(it => {
          $scope.regisList.push({
            ...it,
            fullname: it.name + " " + it.surname,
            date: new Date(it.created),
            dateString: new Date(it.created).toLocaleString()
          })
        });
        $scope.allItemsLoaded = response.data.message.length < 24;
        $scope.loadedPage = true;
        console.log($scope.regisList)
      })
      .catch(errorCallback);
    }

// Functions
  $scope.loadMore = function(){
    $scope.loaded = false;
    $scope.offset += 2;
    init();
  };

  $scope.verifyAction = function(id){
    $scope.loadedPage = false;
    $scope.regisList = []
    $scope.offset = 0
    registrationsAPIService.putAdmin(id, { status: "pending" })
    .then(function(response){
      Notification.success("Verification mail was sent to the company!");
      init();
    })
    .catch(errorCallback);
  };

  $scope.resendAction = function(id){
    $scope.loadedPage = false;
    $scope.regisList = []
    $scope.offset = 0
    registrationsAPIService.putAdmin(id, { status: "resending" })
    .then(function(response){
      Notification.success("Verification mail was re-sent to the company!");
      init();
    })
    .catch(errorCallback);
  };

  $scope.autoVerifyAction = function(id){
    $scope.loadedPage = false;
    $scope.regisList = []
    $scope.offset = 0
    registrationsAPIService.putAdmin(id, { status: "masterVerification" })
    .then(function(response){
      Notification.success("Company was verified by admin!");
      init();
    })
    .catch(errorCallback);
  };
  
  $scope.declineAction = function(id){
    $scope.loadedPage = false;
    $scope.regisList = []
    $scope.offset = 0
  registrationsAPIService.putAdmin(id,{status: "declined" })
    .then(function(response){
      Notification.success("Company was rejected!");
      init();
    })
    .catch(errorCallback);
  };

  // Private functions

  $scope.orderByMe = function(x) {
    if($scope.myOrderBy === x){
      $scope.rev=!($scope.rev);
    }
    $scope.myOrderBy = x;
  };

  $scope.orderByMe = function(x) {
    if($scope.myOrderBy === x){
      $scope.rev=!($scope.rev);
    }
    $scope.myOrderBy = x;
  };

  function errorCallback(err){
    console.log(JSON.stringify(err))
    Notification.error("Server error");
  }

});
