'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('nodeDetailController',
  function ($scope,
            $state,
            $window,
            commonHelpers,
            nodeAPIService,
            userAPIService,
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
    $scope.nAutoenabling = false
    //TEMP
    $scope.deviceUsers = [ { uid: null, name: "disabled"} ]
    $scope.serviceUsers = [ { uid: null, name: "disabled"} ]
    $scope.defaultOwner = { Device: null, Service: null, Marketplace: null}
    $scope.selectedServiceUser = { uid: null, name: "disabled" }
    $scope.selectedDeviceUser = { uid: null, name: "disabled"} 
    // $scope.deviceUsers=[{uid: null, name: "disabled"},{uid:"123", name: "ATA"}, {uid:"321", name: "BETA"}]
    // $scope.serviceUsers=[{uid: null, name: "disabled"},{uid:"123", name: "ATA"}, {uid:"321", name: "BETA"}]

    $scope.creatingNew = true;
    $scope.nodeId = $state.params.nodeId
    $scope.modify = $state.params.modify
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
          $scope.cid = response.data.message.cid;
          $scope.nVisibility = response.data.message.visible;
          $scope.defaultOwner = {...$scope.defaultOwner, ...response.data.message.defaultOwner}
          const autoenabling = response.data.message.defaultOwner
          $scope.nAutoenabling = autoenabling && Object.keys(autoenabling).length != 0;
          $scope.myNode = $scope.nName + " profile view";

          // get availible users for defaultOwner
          userAPIService.getAll($scope.cid)
          .then(function(response) {
            const users = response.data.message
            users.forEach(user => {
              if(user.roles.includes("device owner")){
                $scope.deviceUsers.push({uid: user.uid, name: user.name})
              }
              if(user.roles.includes("service provider")){
                $scope.serviceUsers.push({uid: user.uid, name: user.name})
              }
            });
            if($scope.nAutoenabling && $scope.defaultOwner.Device){
              $scope.selectedDeviceUser={uid: $scope.defaultOwner.Device}
            }
            if($scope.nAutoenabling && $scope.defaultOwner.Service){
              $scope.selectedServiceUser={uid: $scope.defaultOwner.Service}
            }
          }) .catch(function(err){
            console.log(err);
            Notification.error("Server error");
          });
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
      if($scope.modify && !$scope.creatingNew) {
        nodeAPIService.updateOne($state.params.nodeId, {name: $scope.nName, visible: $scope.nVisibility})
          .then(
            function successCallback(response){
              $scope.backToList();
              if(response.error) {
                Notification.error("Error updating Access Point");
              } else {
                nodeAPIService.updateDefaultOwner($state.params.nodeId,$scope.buildDefaultOwnerUpdate()).then(
                  function successCallback(response){
                    Notification.success("Access Point successfully modified!!");
                  }, 
                  function errorCallback(err){
                    console.log(err);
                    Notification.error("Error updating Access Point");
                  })
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
        
      } else {
        $window.alert("The passwords do not match!!");
        $scope.nPass = $scope.nPass2 = "";
      }
    };

    $scope.buildDefaultOwnerUpdate = function(){
      let update = {}
      if(!$scope.nAutoenabling){
        $scope.selectedDeviceUser= { uid: null, name: 'default' }
        $scope.selectedServiceUser= { uid: null, name: 'default' }
      }
      if($scope.defaultOwner.Device != $scope.selectedDeviceUser.uid){
        update.Device = $scope.selectedDeviceUser.uid
      }
      if($scope.defaultOwner.Service != $scope.selectedServiceUser.uid){
        update.Service = $scope.selectedServiceUser.uid
      }
      return update
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
