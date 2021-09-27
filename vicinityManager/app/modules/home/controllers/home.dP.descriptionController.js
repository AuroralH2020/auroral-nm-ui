'use strict';
angular.module('VicinityManagerApp.controllers')
.controller('dPdescriptionController',
function ($scope, $window, $stateParams, commonHelpers, itemsAPIService, Notification) {

// Variables and initData
// ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.loaded = false;
  $scope.item = {};
  $scope.descriptionNew = ""
  $scope.imItemOwner = false;

  // DOM Initialization
  $('a#not2').show();
  $('p#not1').show();
  $('a#not4').hide();
  $('a#not5').hide();
  $('textarea#not3').hide();

  // Get item info from parent
  $scope.$on('itemChanged', function (event, value) {
      $scope.item = value;
      isMyItem();
  });

  initData();

  function initData(){
    $scope.loaded = true
  }

  async function updateItem(data) {
    try {
      await itemsAPIService.putOne($scope.item.oid, data)
      Notification.success("Device updated");
    } catch (err) {
      if (err.status < 500) {
        Notification.warning('Unauthorized or item not found');
      } else {
        Notification.error("Server error");
      }
    }
  }

  function isMyItem() {
    if ($scope.item.uid === $window.sessionStorage.userAccountId) {
      $scope.imItemOwner = true;
    }
  }

  // DOM modifying functions

  $scope.descriptionEdit = function() {
    $('a#not2').hide();
    $('p#not1').hide();
    $('a#not4').show();
    $('a#not5').show();
    $scope.descriptionNew = $scope.item.description;
    $('textarea#not3').show();
  };

  $scope.descriptionCancel = function() {
    $scope.descriptionNew = "";
    $('a#not2').show();
    $('p#not1').show();
    $('a#not4').hide();
    $('a#not5').hide();
    $('textarea#not3').hide();
  };

  $scope.descriptionSave = function() {
    var data = {
      description: $scope.descriptionNew
    };
    updateItem(data);
    $('a#not2').show();
    $('p#not1').show();
    $('a#not4').hide();
    $('a#not5').hide();
    $('textarea#not3').hide();
    $scope.descriptionNew = "";
  };

});