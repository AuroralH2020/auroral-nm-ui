'use strict';
angular.module('VicinityManagerApp.controllers')
.controller('cProleController',
function ($scope, $rootScope, $window, commonHelpers, $stateParams, userAPIService, Notification, AuthenticationService) {

// Initialize variables ========
// ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.userAccounts = [];
  $scope.loaded = false;
  $scope.pageLoaded = false;
  $scope.selectedUser = {};
  $scope.editing = false;
  $scope.newRoles = [];
  $scope.companyId = $stateParams.companyAccountId;
  $scope.rev = false; // Initial sorting set to alphabetical
  // modal
  $scope.modalText = "";
  $scope.askedFunction
  
  $scope.myInit = function(){
  userAPIService.getAll($stateParams.companyAccountId)
    .then(function(response){
        $scope.userAccounts = response.data.message;
        $scope.pageLoaded = true
      })
      .catch(function(err){
        console.log(err);
        Notification.error("Server error");
      });
  };

  $scope.myInit();

// Functions =======

    $scope.updateUserInfo = function(data){
      userAPIService.editInfoAboutUser($scope.selectedUser.uid, data)
        .then(function(response){
          Notification.success("User role modified");
          return AuthenticationService.refresh({roles: data.roles});
        })
        .then(function(response){
          AuthenticationService.SetCredentials(response.data.message);
          // Send event informing of the update of the roles
          $rootScope.$broadcast('refreshToken', {});
          Notification.success("Token refreshed");
          $scope.myInit();
        })
        .catch(function(err){
          if (err.status < 500) {
            console.log(err.status + ': ' + err.statusText)
            Notification.warning(err.data.error);
          } else {
            console.log(err);
            Notification.error("Problem updating user profile");
          }
        });
      };

// Initialize & onChange Select2 Elements ==============

    $(".select2").select2({
      allowClear: true,
      closeOnSelect: false
    });

    $(".select2").change(function() {
      var keyword = new RegExp('devOps');
      if(keyword.test($scope.selectedUser.roles)){
        $scope.newRoles = ['user','devOps'];
      }else{
        $scope.newRoles = ['user'];
      }
      if (this.selectedOptions && this.selectedOptions[0]){
        for(var i = 0; i < this.selectedOptions.length; i++){
          $scope.newRoles.push(this.selectedOptions[i].innerHTML.toString());
        }
      }
    });

    // Button functions ===================

    $scope.startUpdate = function(i){
      $scope.selectedUser = i;
      $(".select2").val($scope.selectedUser.roles).trigger('change'); // Clear selection
      $(".select2").trigger('change');
      $scope.editing = true;
      $scope.loaded = true;
    };

    $scope.updateRoles = function(){
      if($scope.oneAdmin()){
        var query = {roles: $scope.newRoles};
        $scope.updateUserInfo(query);
        $scope.cancelChanges();
      }else{
        Notification.warning("There must be at least one administrator");
        $scope.cancelChanges();
      }
    };

    $scope.cancelChanges = function(){
      $scope.newRoles = [];
      $scope.selectedUser = {};
      $scope.editing = false;
      $scope.loaded = false;
    };

    $scope.deleteUser = function(i){
      $scope.selectedUser = i;
      if($scope.oneAdmin()){
          $scope.testFunction('Are you sure?', async function () {
          $scope.selectedUser = i;
          userAPIService.deleteUser($scope.selectedUser.uid)
          .then(function(response){
            if(response.status === 200){
              Notification.success("User removed");
              $scope.myInit();
            } else {
              Notification.warning(response.data[0].result);
            }
          })
          .catch(function(err){
            console.log(err);
            Notification.error(err.data.error);
          });
        })
      } else{
        Notification.warning("There must be at least one administrator");
        $scope.cancelChanges();
      }
    };
    // MODAL
    // ask and do
    $scope.testFunction = function (question, fun){
      $scope.askedFunction = fun
      $scope.modalText = question
      $scope.showModal()
    }

    // Modal
    $scope.showModal = function (id) {
        $('div#modal2').show();
    };
    $scope.modalOk = async function(){
      $('div#modal2').hide();
      await $scope.askedFunction()
    }
    $scope.modalCancel = function(){
      $('div#modal2').hide();
    } 

    // Ensure at least one admin in company
    $scope.oneAdmin = function(){
      var keyword = new RegExp('administrator');
      var cont = 0;
      // Find out if removing admin role
      try{
        if(keyword.test($scope.selectedUser.roles) && !keyword.test($scope.newRoles)){
          for(var i = 0; i < $scope.userAccounts.length; i++){
            if(keyword.test($scope.userAccounts[i].roles)){
              cont++;
            }
          }
          if(cont <= 1){ return false; } else { return true; }
        }
        else { return true; }
      } catch(err) {
        console.log(err);
        Notification.warning("Problem checking data");
        return false;
      }
    };

    // Sorting
    $scope.onSort = function(order){
      $scope.rev = order;
    };


});
