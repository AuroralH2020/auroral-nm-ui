'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('sessionsController',
  function ($scope,
            commonHelpers,
            sessionsService,
            Notification) {

// Initialize variables and get initial resources

// ====== Triggers window resize to avoid bug =======
    commonHelpers.triggerResize();

    $scope.loadedPage = false;
    $scope.sessionsList = [];
    $scope.cursor = 0
    $scope.rev = false;
    $scope.myOrderBy = 'session_start';

    init();

    function init(){
      sessionsService.getAllSessions($scope.cursor)
      .then(function(response){
        $scope.cursor = response.data.message.cursor
        $scope.sessionsList = response.data.message.sessions.map(
          (it) => { 
            const session = it.split(':')
            return {
              uid: session[0],
              username: session[1],
              session_start: new Date(Number(session[2])*1000).toLocaleString(),
              ip: session[3]
            }
          }
        );
        // console.log($scope.regisList)
        $scope.loadedPage = true;
      })
      .catch(errorCallback);
    }

// Functions

  $scope.removeAction = function(uid){
    $scope.loadedPage = false;
    sessionsService.removeSession(uid)
    .then(function(response){
      Notification.success("Session Removed!");
      $scope.cursor = 0
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

  $scope.onSort = function(order){
    $scope.rev = order;
  };

  function errorCallback(err){
  }

});
