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
  //TBD - get domains from backend?
  $scope.availibleDomains = ["Undefined", "Energy", "Mobility", "Health", "Farming", "Tourism", "Weather", "Indoor quality"];

  // DOM Initialization
  $('.descEdit').hide();
  $('.descNormal').show();

  // Get item info from parent
  $scope.$on('itemChanged', function (event, value) {
      $scope.item = value;
      isMyItem();
  });

  initData();

  function initData(){
    $scope.item = $scope.$parent.item
    isMyItem();
    $scope.loaded = true
  }

  async function updateItem(data) {
    try {
      await itemsAPIService.putOne($scope.item.oid, data)
      Notification.success("Device updated");
      $scope.$parent.childHook()
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
    $('.descNormal').hide()
    $('.descEdit').show()
    $scope.descriptionNew = $scope.item.description;
  };

  $scope.descriptionCancel = function() {
    $scope.descriptionNew = "";
    $('.descNormal').show()
    $('.descEdit').hide()

  };

  $scope.descriptionSave = function() {
    var data = {
      description: $scope.descriptionNew,
      labels: {
        domain: $('select#editDomain').val()
      }
    };
    updateItem(data);
    $('.descNormal').show()
    $('.descEdit').hide()
    $scope.descriptionNew = "";
  };

});