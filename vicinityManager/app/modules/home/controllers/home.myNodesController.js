'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('myNodesController',
  function ($scope, $state, $window, commonHelpers, nodeAPIService, Notification) {

// ======== Set initial variables ==========

// ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  // Ensure scroll on top onLoad
  $window.scrollTo(0, 0);

  $scope.imMobile = Number($window.innerWidth) < 768;
  $(window).on('resize',function(){
    $scope.imMobile = Number($window.innerWidth) < 768;
  });

  $scope.rev = false;
  $scope.myOrderBy = 'name';
  $scope.loadedPage = false;
  $scope.gatewayKey = "";
  $scope.nodeUpdatingKey = "";
  // modal
  $scope.modalText = "";
  $scope.askedFunction

  $('div#keymodal').hide();
  $('div#modal2').hide();
  $(document).keyup(function(e) {
     if (e.keyCode == 27) {
        $('div#keymodal').hide();
        $('div#modal2').hide();
    }
  });

  var myInit = function(){
  nodeAPIService.getAll()
  .then(function(response){
      $scope.nodes = response.data.message;
      $scope.loadedPage = true;
    })
    .catch(function(err){
      console.log(err);
      Notification.error("Server error");
    });
  };

  myInit();

// ======== Main functions =========

// Remove func
$scope.deleteNode = function(agid){

  $scope.testFunction('Are you sure? It may take some time (Approx 1min every 100 items)', async function () {
    $scope.loadedPage = false;
    nodeAPIService.removeKey(agid)
    .then(
      function successCallback(response){
        return nodeAPIService.removeOne(agid); // upd status to removed of node in MONGO
    })
    .then(
      function successCallback(response){
          $scope.loadedPage = true;
          Notification.success("Access Point successfully removed!!");
          myInit();
      })
      .catch(function(err){
        console.log(err);
        Notification.error("Error deleting node");
      });
  })
  };
  // Access node management
  $scope.goToEdit = function(i){
      $state.go("root.main.nodeDetail",{ nodeId: i, modify: true });
  };

// MODALS
$scope.showModal = function (id) {
  nodeAPIService.getKey(id) // upd status to removed of node in MONGO
  .then(
    function successCallback(response){
      if(response.data.message){
        $scope.gatewayKey = response.data.message;
      } else {
        $scope.gatewayKey = "";
      }
      $scope.nodeUpdatingKey = id;
      $('div#keymodal').show();
  })
  .catch(function(err){
    console.log(err);
    Notification.error("Error retrieving key");
  });
};

$scope.saveModal = function () {
  if(!$scope.gatewayKey ){
    Notification.error("Please provide valid key");
    return
  }
  nodeAPIService.updateOne($scope.nodeUpdatingKey, {key: $scope.gatewayKey})
  .then(
    function successCallback(response){
      $('div#keymodal').hide();
      updateNodeKey($scope.nodeUpdatingKey, true);
      $scope.nodeUpdatingKey = "";
      $scope.gatewayKey = "Introduce your public key here";
      Notification.success("Key successfully stored!");
    })
    .catch(function(err){
      console.log(err);
      Notification.error("Error storing key");
    });
};

$scope.removeModal = function () {
  nodeAPIService.removeKey($scope.nodeUpdatingKey)
  .then(
    function successCallback(response){
      $('div#keymodal').hide();
      updateNodeKey($scope.nodeUpdatingKey, false);
      $scope.nodeUpdatingKey = "";
      $scope.gatewayKey = "Introduce your public key here";
      Notification.success("Key successfully removed!");
  })
  .catch(function(err){
    console.log(err);
    Notification.error("Error removing key");
  });
};

$scope.closeModal = function () {
  $scope.nodeUpdatingKey = "";
  $scope.gatewayKey = "Introduce your public key here";
  $('div#keymodal').hide();
};

$scope.editVisibility = function (_agid, visibility) {
  nodeAPIService
    .updateOne(_agid, { visible: visibility })
    .then(function successCallback(response) {
      Notification.success("Visibility updated");
      myInit()
    })
    .catch(function (err) {
      console.log(err);
      Notification.error("Error updating visibility");
    });
};

// Modal YES or NO
// ask and do
$scope.testFunction = function (question, fun){
  $scope.askedFunction = fun
  $scope.modalText = question
  $('div#modal2').show();
}
$scope.modalOk = async function(){
  $('div#modal2').hide();
  await $scope.askedFunction()
}
$scope.modalCancel = function(){
  $('div#modal2').hide();
} 

$scope.copyToClipboard = function (oid) {
  navigator.clipboard.writeText(oid).then(function() {
    Notification.success("AGID has been copied");
  }, function(err) {
    Notification.error("Could not copy text");
  });
}

// ==== Navigation functions =====

    $scope.orderByMe = function(x) {
      if($scope.myOrderBy === x){
        $scope.rev = !($scope.rev);
      }
      $scope.myOrderBy = x;
    };

    $scope.onSort = function(order){
      $scope.rev = order;
    };

// Other Functions

  function updateNodeKey(agid, status){
    for(var i = 0, l = $scope.nodes.length; i < l; i++){
      if($scope.nodes[i].agid === agid){
        $scope.nodes[i].hasKey = status;
      }
    }
  }

});
