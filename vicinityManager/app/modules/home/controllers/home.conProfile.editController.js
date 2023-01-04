"use strict";
angular.module('VicinityManagerApp.controllers')
/*
Filters the items based on the following rules:
- If it is my company profile I see all the items which belong to me
- If it is other company profile I see all its items which:
  . are flagged as public
  . if I am partner of the company, also items flagged for friends
*/
.controller('conProfileEditController',
function ($scope, $window, commonHelpers, $stateParams, tokenDecoder, contractAPIService,  Notification, configuration) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.cid = $window.sessionStorage.companyAccountId;
  $scope.uid = $window.sessionStorage.userAccountId;
  $scope.items = [];
  $scope.allItemsLoaded = false;
  $scope.loadedPage = false;
  $scope.loaded = false;
  $scope.ctid = $stateParams.contractId
  $scope.infrastructureOperator = false;
  $scope.offset = 0;

  function init(){

    contractAPIService.getContractCompanyItems($stateParams.contractId, $scope.offset)
      .then(successCallback)
      .catch(errorCallback);
      getToken();
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
    $scope.items=[]
    for(var i = 0; i < response.data.message.length; i++){
        if(response.data.message[i].accessLevel === 2) { 
          response.data.message[i].privacyCaption = 'Public';
        } else if(response.data.message[i].accessLevel === 1) { 
          response.data.message[i].privacyCaption = 'For Friends'; 
        } else { 
          response.data.message[i].privacyCaption = 'Private'; 
        }
        $scope.items.push(response.data.message[i]);
    }
    $scope.noItems = ($scope.items.length === 0);
    $scope.allItemsLoaded = response.data.message.length < 12;
    $scope.loaded = true;
    $scope.loadedPage = true;
  }
  // change item status
  $scope.itemContractStatus = async function (ctid, oid, status){
    try {
        const response = await contractAPIService.editContractItem(ctid, oid, { enabled: status })
        Notification.success('Status changed')
        init()
    } catch (err) {
      if (err.status < 500) {
        Notification.warning(err.message);
      } else {
        Notification.error("Server error");
        console.log(err.message)
      }
    }
  }
  // change item rw status
  $scope.itemContractRw = async function (ctid, oid, status){
    try {
      const response = await contractAPIService.editContractItem(ctid, oid, { rw: status })
      Notification.success('Permissions changed')
      init()
    } catch (err) {
      if (err.status < 500) {
        Notification.warning(err.message);
      } else {
        Notification.error("Server error");
        console.log(err.message)
      }
    }
  }
  // change item enabled
  $scope.addItemToContract = async function (ctid, oid, status, privacy){
    try {
      if(privacy === 0){
          Notification.warning('Item privacy is too low')
        }
        else{
        if(status){
          const response = await contractAPIService.addContractItem(ctid, oid)
          Notification.success(' Item added')
        } else {
          const response = await contractAPIService.removeContractItem(ctid, oid)
          Notification.success(' Item removed')
        }
        $scope.$parent.childHook()
      }
      init()
    } catch (err) {
      if (err.status < 500) {
        Notification.warning(err.message);
      } else {
        Notification.error("Server error");
        console.log(err.message)
      }
    }
  }

  function getToken() {
    const payload = tokenDecoder.deToken();
    const rolesArr = payload.roles.split(",");
    for (var i in rolesArr) {
      if (rolesArr[i] === "device owner") {
        $scope.imDeviceOwner = true;
      }
      if (rolesArr[i] === "infrastructure operator") {
        $scope.infrastructureOperator = true;
      }
    }
  }
  
  function errorCallback(err){
    console.log(err);
    Notification.error("Problem retrieving items");
  }

});

