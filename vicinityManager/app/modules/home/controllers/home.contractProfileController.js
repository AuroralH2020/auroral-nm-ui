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
      // hide modal
      $('div#fixDiscoverabilityModal').hide();


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
      $scope.descriptionNew = ''
      $scope.nodesNonDiscoverable = []
      $scope.comparison = undefined
      $scope.dltLoaded = false
      $scope.showDltResult = false
      // Initialize controller

      $('.descriptionNormal').show();
      $('.descriptionEdit').hide();

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
              $scope.contract.createdDate = new Date($scope.contract.created).toLocaleString();
              $scope.isMyOrgContract = $window.sessionStorage.companyAccountId === $scope.contract.cid;
              if ($scope.contract.organisations.includes($window.sessionStorage.companyAccountId)) {
                $scope.accepted = true;
                $scope.isMyContract = true;
              }
              if ($scope.contract.pendingOrganisations.includes($window.sessionStorage.companyAccountId)) {
                $scope.accepted = false;
              }
              getToken();
              getNonDiscoverableNodes();
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
      function getNonDiscoverableNodes() {
        contractAPIService.isDiscoverable($stateParams.contractId).then(function (response) {
          $scope.nodesNonDiscoverable = response.data.message;
        }).catch(function (err) {
          if (err.status === 404) {
            console.log(err);
            Notification.error("Problem retrieving contract details");
            $state.go("root.main.allContracts");
          } else {
            console.log(err);
            Notification.error("Server error");
          }
        });
      }
      /* MAIN FUNCTIONS */


      // save modal - fix discoverability
      $scope.saveModal1 = async function () {
        try {
          const data = await contractAPIService.makeDiscoverable($stateParams.contractId)
          $('div#fixDiscoverabilityModal').hide();
          Notification.success('All items are now discoverable')
          initData();
        } catch (err) {
          Notification.error('Error fixing discoverability')
          console.log(err)
        }
      };
      // Open modal
      $scope.openModal1 = async function () {
        $('div#fixDiscoverabilityModal').show();
      }

      // Hide modal
      $scope.closeModal1 = function () {
        $('div#fixDiscoverabilityModal').hide();
      };

      // Open modal
      $scope.openModal2 = async function () {
        try {
          $scope.dltLoaded = false
          const data = await contractAPIService.compareWithDLT($stateParams.contractId)
          $scope.dltLoaded = true
          // console.log(data)
          // if (data.status != '200') {
          //   Notification.error('Error comparing with DLT')
          //   return
          // }
          $scope.comparison = data.data.message;

          $scope.comparison.mongo.created = $scope.comparison.mongo.created ?  new Date($scope.comparison.mongo.created).toLocaleDateString() : 'Not available';
          $scope.comparison.mongo.lastUpdated = $scope.comparison.mongo.lastUpdated ? new Date($scope.comparison.mongo.lastUpdated).toLocaleDateString() : 'Not available';
          // transform timestamp to date
          if($scope.comparison.checks.contractInDlt) {
            $scope.comparison.dlt.created = $scope.comparison.dlt.created ? new Date($scope.comparison.dlt.created).toLocaleDateString() : 'Not available';
            $scope.comparison.dlt.lastUpdated = $scope.comparison.dlt.lastUpdated ? new Date($scope.comparison.dlt.lastUpdated).toLocaleDateString() : 'Not available';
          }
          $('div#dltCheckModal').show();
        } catch (error) {
          Notification.error('Error comparing with DLT')
        }
      }

      // Hide modal
      $scope.closeModal2 = function () {
        $('div#dltCheckModal').hide();
      };

      // Change status

      $scope.answerRequest = async function (ctid, val) {
        try {
          if (val) {
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
      $scope.removeFromContract = async function (ctid) {
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
      $scope.descriptionEdit = async function () {
        $scope.descriptionNew = $scope.contract.description
        $('.descriptionNormal').hide();
        $('.descriptionEdit').show();
      }
      $scope.descriptionSave = async function () {
        try {
          await contractAPIService.updateContract($scope.contract.ctid, { description: $scope.descriptionNew })
          Notification.success('Description updated')
          initData();
        } catch (err) {
          if (error.status < 500) {
            Notification.warning(error.data.error);
          } else {
            console.log(error)
            Notification.error("Server error");
          }

        }
        $('.descriptionNormal').show();
        $('.descriptionEdit').hide();
      }
      $scope.descriptionCancel = async function () {
        $('.descriptionNormal').show();
        $('.descriptionEdit').hide();
      }

      // Toggle dlt result
      $scope.toggleResult = async function () {
        $scope.showDltResult = !$scope.showDltResult
      }
    }
  );
