"use strict";
angular
  .module("VicinityManagerApp.controllers")
  .controller(
    "communityProfileController",
    function (
      $scope,
      $window,
      $state,
      commonHelpers,
      tokenDecoder,
      $stateParams,
      $location,
      communityService,
      Notification,
      configuration
    ) {
      $scope.locationPrefix = $location.path();

      // Initialize variables and data
      commonHelpers.triggerResize(); // Triggers window resize to avoid bug
      $scope.showInput = false;
      $scope.isMyOrgContract = false;
      $scope.infrastructureOperator = false;
      $scope.loaded = false;
      $scope.community = {};
      $scope.inCommunity = false
      $scope.accessLevelNew = 0;
      $scope.descriptionNew = ''
      // Initialize controller


      initData();

      // Listen for changes and broadcast to children

      $scope.$on('communityChanged', function(event, data){
        initData()
      });

      // Functions
      function initData() {
        communityService.getCommunity($stateParams.commId)
          .then(function (response) {
            $scope.loaded = false;
            try {
              $scope.community = response.data.message;
              $scope.community.createdDate = new Date($scope.community.created).toLocaleDateString();
              $scope.community.nodesNum = response.data.message.organisations.map((org) => org.nodes.length).reduce((a, b) => a + b)
              getToken();
              $scope.loaded = true;
            } catch (err) {
              console.log(err);
              Notification.error("Problem initializing data");
            }
          })
          .catch(function (err) {
            if (err.status === 404) {
              console.log(err);
              Notification.error("Community not found");
              $state.go("root.main.allCommunities");
            } else {
              console.log(err);
              Notification.error("Server error");
            }
          });
      }

      $scope.childHook = function () {
        initData();

      };
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

      /* MAIN FUNCTIONS */

      // Change status


      // Leave contract
      $scope.leaveCommunity = async function (ctid) {
        try {
          await communityService.leaveCommunity(ctid)
          Notification.success('Community leaved ');
          // TODO?????
          $state.go("root.main.allCommunities");
        } catch (error) {
          if (error.status < 500) {
            Notification.warning(error.data.error);
          } else {
            console.log(error)
            Notification.error("Server error");
          }
        }
      }
      // Copy
      $scope.copyToClipboard = function (oid, id = "ID") {
        navigator.clipboard.writeText(oid).then(
          function () {
            Notification.success(id + " has been copied");
          },
          function (err) {
            Notification.error("Could not copy text");
          }
        );
      };
    }
  );
