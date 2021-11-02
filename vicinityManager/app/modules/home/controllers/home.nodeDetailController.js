'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('nodeDetailController',
  function ($scope,
            $state,
            $window,
            commonHelpers,
            nodeAPIService,
            Notification) {

// ======== Set initial variables ==========

// ====== Triggers window resize to avoid bug =======
    commonHelpers.triggerResize();
    $scope.nName = "";
    $scope.nVisibility = "";
    $scope.nUri = "";
    $scope.nAgent = "";
    $scope.nPass = "";
    $scope.nPass2 = "";
    $scope.nId = "";
    $scope.nAgentType = "";

    $scope.creatingNew = true;
    $scope.nodeId = $state.params.nodeId;
    $scope.myNode = "Creating new Access Point";

    if($scope.nodeId !== '0'){
    $scope.creatingNew = false;
    nodeAPIService.getOne($state.params.nodeId)
      .then(function(response){
          $scope.nName = response.data.message.name;
          // $scope.nUri = response.data.message.eventUri;
          // $scope.nAgent = response.data.message.agent;
          $scope.nAgentType = response.data.message.type;
          $scope.nId = response.data.message.agid;
          $scope.nVisibility = response.data.message.visible;
          $scope.myNode = $scope.nName + " profile view";
        })
        .catch(function(err){
          console.log(err);
          Notification.error("Server error");
        });
    } else {
      $scope.nAgentType = "Auroral";
    }

// ======== Main functions =========

    $scope.submitNode = function(){
      // Update existing node
      if($scope.modify) {
        nodeAPIService.updateOne($state.params.nodeId, {name: $scope.nName})
          .then(
            function successCallback(response){
              if(response.error) {
                Notification.success("Error updating Access Point");
                $scope.backToList();
              } else {
                Notification.success("Access Point successfully modified!!");
                $scope.backToList();
              }
            },
            function errorCallback(err){
              console.log(err);
              Notification.error("Error updating Access Point");
            }
          );
          $scope.modify=false
        }
      if($scope.nPass === $scope.nPass2){
        // Create new node
        if ($scope.creatingNew) {
          var query = {
            name: $scope.nName,
            type: $scope.nAgentType,
            password: $scope.nPass
          };
        nodeAPIService.postOne(query)
        .then(function(response){
          if(response.error) {
            Notification.success("Error creating Access Point");
            $scope.backToList();
          } else {
            Notification.success("Access Point successfully created!!");
            $scope.backToList();
          }
        })
        .catch(function(err){
          console.log(err);
          Notification.error("Error creating Access Point");
        });
        } 
        
      }else{
        $window.alert("The passwords do not match!!");
        $scope.nPass = $scope.nPass2 = "";
      }
    };

// ==== Navigation functions =====

    $scope.backToList = function(){
        $state.go("root.main.myNodes");
    };

    $scope.toModify= function(){
      $scope.modify = true;
      $scope.myNode = "Modifying Access Point: " + $scope.nName;
    };

  });
