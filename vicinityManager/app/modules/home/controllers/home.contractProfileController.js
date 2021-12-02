"use strict";
angular
  .module("VicinityManagerApp.controllers")
  .controller(
    "contractProfileController",
    function (
      $scope,
      $window,
      $state,
      commonHelpers,
      tokenDecoder,
      $stateParams,
      $location,
      contractAPIService,
      Notification,
      configuration
    ) {
      $scope.locationPrefix = $location.path();

      // Initialize variables and data

      commonHelpers.triggerResize(); // Triggers window resize to avoid bug

      $scope.showInput = false;
      $scope.accepted = false;
      $scope.isMyContract = false;
      $scope.isMyOrgContract = false;
      $scope.imDeviceOwner = false;
      $scope.infrastructureOperator = false;
      $scope.loaded = false;
      $scope.contract = {};
      $scope.accessLevelNew = 0;
      // Initialize controller

      initData();

      // Listen for changes and broadcast to children

      $scope.$watch("contract", function (value) {
        $scope.$broadcast("contractChanged", value);
      });

      // Functions
      function initData() {
        contractAPIService.getContract($stateParams.contractId)
          .then(function (response) {
            $scope.isMyContract = false;
            $scope.isMyOrgContract = false;
            $scope.loaded = false;
            try {
              $scope.contract = response.data.message;
              $scope.isMyOrgContract = $window.sessionStorage.companyAccountId === $scope.contract.cid;
              if ($scope.contract.organisations.includes($window.sessionStorage.companyAccountId)) {
                $scope.accepted = true;
                $scope.isMyContract = true;
              }
              if ($scope.contract.pendingOrganisations.includes($window.sessionStorage.companyAccountId)) {
                $scope.accepted = false;
              }
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
              Notification.error("Contract not found");
              $state.go("root.main.allContracts");
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

      $scope.answerRequest = async function (ctid, val) {
        try {
          if(val) {
            await contractAPIService.acceptContractRequest(ctid)
            Notification.success("Contract request accepted");
            initData();
          }
          else {
            await contractAPIService.rejectContractRequest(ctid)
            Notification.success("Contract request rejected");
            $state.go("root.main.allContracts");
          }
        } catch (err) {
          if (err.status < 500) {
            Notification.warning(err.message);
          } else {
            Notification.error("Server error");
            console.log(err.message)
          }
        }
      };

      // Leave contract
      $scope.removeFromContract = async function(ctid) {
          try {
            await contractAPIService.removeOrgFromContract(ctid)
            Notification.success('Contract leaved ');
              $state.go("root.main.allContracts");
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
