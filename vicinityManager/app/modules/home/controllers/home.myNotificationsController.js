'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('myNotificationsController',
  function ($scope,
            $window,
            commonHelpers,
            notificationsAPIService,
            tokenDecoder,
            contractAPIService,
            registrationsHelpers,
            userAccountsHelpers,
            Notification) {

// ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

// Ensure scroll on top onLoad
  $window.scrollTo(0, 0);

// ======= Set initial variables ==========
  $scope.loadedPage = false;
  $scope.notifs = [];
  $scope.dates = [];
  $scope.pendingNotificationsOnly = false;
  $scope.limit = 12;
  $scope.offset = 0;
  $scope.allItemsLoaded = false;
  $scope.userId = $window.sessionStorage.userAccountId;
  $scope.orgId = $window.sessionStorage.companyAccountId;

// ====== Getting notifications ======

  init();

  function init(){
    $scope.loadedPage = false;
    notificationsAPIService.getNotifications($scope.limit, $scope.offset, $scope.pendingNotificationsOnly)
    .then(getNotifs)
    .catch(function(err){
      console.log(err);
      Notification.error("Server error");
    });
  }

// === Support functions ===========

  function getNotifs(response){
    var date;
    var hours, minutes;
    var dates = [];
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var newNotifs = response.data.message;
    // Add timestamp and date strings to the new notifications
    for(var i = 0, l = newNotifs.length; i<l ; i++){
      date = new Date(newNotifs[i].created);
      newNotifs[i].timestamp = date;
      newNotifs[i].dateCaption = date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
      hours = date.getHours();
      minutes = date.getMinutes() / 10 < 1 ? "0" + date.getMinutes() : date.getMinutes();
      newNotifs[i].timeCaption = hours + ":" + minutes;
      if(newNotifs[i].isUnread){
        // Mark notification unReaded=false
        readNotification(newNotifs[i].notificationId)
      }
      if ($scope.dates.indexOf(newNotifs[i].dateCaption) === -1){
        $scope.dates.push(newNotifs[i].dateCaption);
      }
      $scope.notifs.push(newNotifs[i]);
    }
    // Sort final array of notifications
    $scope.notifs.sort(function(a,b){
      return b.timestamp - a.timestamp;
    });
    // Check if all notifications have been retrieved and enable the view in the DOM
    $scope.allItemsLoaded = newNotifs.length < 12;
    $scope.loadedPage = true;
  }

  function reset(){
    // Reset all arrays and values before change notification type
    $scope.notifs = [];
    $scope.loadedPage = false;
    $scope.offset = 0;
    $scope.dates = [];
    // Reload notifications with the new settings
    init();
  }
  
  // Mark notification unReaded=false
  async function readNotification(id) {
    await notificationsAPIService.setRead(id)
  }

// ==== Functions accessed by DOM =====

$scope.notifType = function(pending){
  $scope.pendingNotificationsOnly = pending;
  reset();
};

$scope.loadMore = function(){
    $scope.loadedPage = false;
    $scope.offset += $scope.limit;
    init();
};

// ========= Accept / Reject requests ==========

  $scope.acceptNeighbourRequest = function (notifId, friendId){
    userAccountsHelpers.acceptNeighbourRequest(friendId)
    .then(reset)
    .catch(function(err){
      console.log(err);
      Notification.error("Error accepting neighbourhood request");
    });
  };

  $scope.rejectNeighbourRequest = function(notifId, friendId) {
    userAccountsHelpers.rejectNeighbourRequest(friendId)
    .then(reset)
    .catch(function(err){
      console.log(err);
      Notification.error("Error rejecting neighbourhood request");
    });
  };

  $scope.acceptRegistration = function (notifId, reg_id) {
   registrationsHelpers.acceptRegistration(reg_id, notifId)
    .then(reset)
    .catch(function(err){
      console.log(err);
      Notification.error("Error accepting registration");
    });
  };

  $scope.rejectRegistration = function (notifId, reg_id) {
    registrationsHelpers.rejectRegistration(reg_id, notifId)
      .then(reset)
      .catch(function(err){
        console.log(err);
        Notification.error("Error rejecting registration");
      });
  };

  $scope.acceptContractRequest = function (ctid){
    console.log(ctid)
    contractAPIService.acceptContractRequest(ctid)
    .then(reset)
    .catch(function(err){
      console.log(err);
      Notification.error("Error accepting contract request");
    });
  }
  $scope.rejectContractRequest = function (ctid){
    contractAPIService.acceptContractRequest(ctid)
    .then(reset)
    .catch(function(err){
      console.log(err);
      Notification.error("Error rejecting contract request");
    });
  }


});
