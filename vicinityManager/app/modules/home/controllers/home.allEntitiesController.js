'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('allEntities', function ($scope, commonHelpers, searchAPIService, userAccountAPIService, $stateParams, $window, Notification, configuration) {

    // Ensure scroll on top onLoad
      $window.scrollTo(0, 0);

      $scope.imMobile = Number($window.innerWidth) < 1000;
      $(window).on('resize',function(){
        $scope.imMobile = Number($window.innerWidth) < 1000;
      });

    // Variables
    $scope.resultsList = [];
    $scope.loaded = false;
    $scope.activeCompanyID = $window.sessionStorage.companyAccountId;
    $scope.offset = 0;
    $scope.filterNumber = 0;
    $scope.entitiesCaption = "All organisations";
    $scope.myFriends = [];
    $scope.allItemsLoaded = false;
    $scope.listView = false;
    $scope.myOrderBy = 'name';

    // ====== Triggers window resize to avoid bug =======
    commonHelpers.triggerResize();

    // Get initial resources
    async function getMyOrganisationFriends() {
      $scope.myFriends = (await userAccountAPIService.getUserAccountProfile($scope.activeCompanyID)).data.message.knows
    }

    function init(){
      userAccountAPIService.getUserAccounts($scope.activeCompanyID, $scope.filterNumber, $scope.offset)
      .then(function(response){
          var newOrgs = response.data.message.map((it) => {
              return {
                avatar: it.avatar || configuration.avatarOrg,
                cid: it.cid,
                name: it.name,
                location: it.location,
                knows: it.knows
            }
          });
          $scope.resultsList = $scope.resultsList.concat(newOrgs)
          $scope.allItemsLoaded = response.data.message.length < 12;
          $scope.loaded = true;
        })
        .catch(function(err){
          console.log(err);
          Notification.error("Server error");
        });
      }

    getMyOrganisationFriends();
    init();

      // Private functions

      $scope.filterOrganisations = function(n){
        try{
          $scope.filterNumber = n;
          if(n === 0){ $scope.entitiesCaption = "All organisations"; }
          else if(n === 1){ $scope.entitiesCaption = "My partners"; }
          else{ $scope.entitiesCaption = "Other organisations"; }
          $scope.loaded = false;
          $scope.resultsList = [];
          $scope.offset = 0;
          init();
        } catch(err){
          init();
          console.log(err);
          Notification.warning("Error filtering organisations");
        }
      };

      // Trigers load of more items

      $scope.loadMore = function(){
          $scope.loaded = false;
          $scope.offset += 12;
          init();
      };

      $scope.changeView = function(){
        $scope.listView = !($scope.listView);
      };

      $scope.orderByMe = function(x) {
        if($scope.myOrderBy === x){
          $scope.rev=!($scope.rev);
        }
        $scope.myOrderBy = x;
      };

      $scope.onSort = function(order){
        $scope.rev = order;
      };
  });
