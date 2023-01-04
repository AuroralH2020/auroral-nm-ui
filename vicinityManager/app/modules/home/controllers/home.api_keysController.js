'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('api_keysController',
    function ($scope,
      commonHelpers,
      api_keysService,
      $window,
      tokenDecoder,
      nodeAPIService,
      Notification) {

      // Initialize variables and get initial resources

      // ====== Triggers window resize to avoid bug =======
      commonHelpers.triggerResize();

      $scope.loadedPage = false;
      $scope.sessionsList = [];
      $scope.cursor = 0
      $scope.rev = false;
      $scope.myOrderBy = 'session_start';
      $scope.ACLDetailInfo = {};
      $scope.myCid = $window.sessionStorage.companyAccountId
      $scope.newApiKeySettings = {
        types: ['whole organisation', 'per node', 'per item'],
      };
      $scope.availibleNodes = [];
      $scope.newApiKeySelected = {
        type: undefined,
        name: undefined,
        grantType: undefined,
        oid: {
          type: 'all',
        },
        agid: {
          nodes: []
        }
      };
      //Hide modals
      $('div#modalACLDetail').hide();
      $('div#modalNewApiKey').hide();
      init();

      function init() {
        // Roles
        var payload = tokenDecoder.deToken();
        $scope.isDevOwn = payload.roles.includes('device owner');
        $scope.isServProv = payload.roles.includes('service provider');
        $scope.isIntegrator = payload.roles.includes('system integrator');
        $scope.isAdmin = payload.roles.includes('administrator');

        api_keysService.getAll()
          .then(function (response) {
            $scope.api_keys = response.data.message.map(function (item) {
              return {
                name: item.name,
                keyid: item.keyid,
                grantType: item.grantType[0],
                ACL: item.ACL,
                created: new Date(item.created).toLocaleTimeString() + ' ' + new Date(item.created).toLocaleDateString(),
              };
            });
            $scope.loadedPage = true;
          })
          .catch(errorCallback);
      }

      // Functions
      $scope.removeKey = function (id) {
        if(!$scope.isAdmin ) {
          Notification.error('You do not have permission to remove API');
          return
        }
        $scope.loadedPage = false;
        api_keysService.removeApi_key(id)
          .then(function (response) {
            Notification.success("API key Removed!");
            init();
          })
          .catch(errorCallback);
      };

      $scope.showACLDetail = function (id) {
        const key = $scope.api_keys.filter((item) => { return item.keyid === id })
        if (!key && !key[0]) {
          Notification.error('Error getting ACL details');
        }
        $scope.ACLDetailInfo = {
          name: key[0].name,
          keyid: key[0].keyid,
          ACL: key[0].ACL,
        }
        $('div#modalACLDetail').show();
        // Show modal
      };
      $scope.closeACLDetail = function (id) {
        $('div#modalACLDetail').hide();
        // Show modal
      };

      $scope.openAddNewKey = async function () {
        try {
          if(!$scope.isAdmin && !$scope.isDevOwn && !$scope.isServProv && !$scope.isIntegrator) {
            Notification.error('You do not have permission to add API keys');
            return
          }
          const response = await nodeAPIService.getAll()
          $scope.availibleNodes = response.data.message
          $('div#modalNewApiKey').show();
        } catch (err) {
          Notification.error('Unable to create new community')
          console.log(err)
        }
      };

      $scope.closeAddNewKey = function () {
        $scope.newApiKeySelected.name = undefined
        $scope.newApiKeySelected.type = undefined
        $scope.newApiKeySelected.grantType = undefined
        $scope.newApiKeySelected.oid.type = 'all'
        $scope.newApiKeySelected.agid.nodes = []
        $scope.availibleNodes = []
        $scope.newApiKeySelected.agid.nodes = []
        $('div#modalNewApiKey').hide();
      };

      $scope.storeAddNewKey = function () {
        if (!$scope.newApiKeySelected.name) {
          Notification.error('Please enter a name for the new API key')
          return
        }
        if ($scope.newApiKeySelected.type == undefined) {
          Notification.error('Please select a filtering type for the new API key')
          return
        }
        if ($scope.newApiKeySelected.grantType == undefined) {
          Notification.error('Please select a grantType for the new API key')
          return
        }
        let api_key = {
          name: $scope.newApiKeySelected.name,
          grantType: $scope.newApiKeySelected.grantType,
          ACL: {}
        }
        if ($scope.newApiKeySelected.type == 'cid') {
          api_key.ACL.cid = [$scope.myCid]
        } else if ($scope.newApiKeySelected.type == 'oid') {
          api_key.ACL.oid = ['all']
        } else if ($scope.newApiKeySelected.type == 'agid') {
          api_key.ACL.agid = $scope.newApiKeySelected.agid.nodes.map(o => { return o.agid })
        }
        api_keysService.createApi_key(api_key).then(response => {
          if (response.status == 200) {
            $scope.ACLDetailInfo = response.data.message
            Notification.success('API key created')
            $scope.closeAddNewKey()
            $('div#modalACLDetail').show();
            init()
          }
        }
        )
      }

      $scope.addNode = function () {
        if ($scope.selectedNewNode) {
          $scope.availibleNodes = $scope.availibleNodes.filter(function (n) {
            return n.agid != $scope.selectedNewNode.agid
          });
          $scope.newApiKeySelected.agid.nodes.push($scope.selectedNewNode)
          $scope.newApiKeySelected.agid.nodes = $scope.newApiKeySelected.agid.nodes.sort((a, b) => a.name[0] > b.name[0])
          $scope.availibleNodes = $scope.availibleNodes.sort((a, b) => a.name[0] > b.name[0])
        }
      };

      $scope.removeNode = function (node) {
        $scope.newApiKeySelected.agid.nodes = $scope.newApiKeySelected.agid.nodes.filter(function (n) {
          return n.agid != node.agid
        });
        $scope.availibleNodes.push(node)
        $scope.newApiKeySelected.agid.nodes = $scope.newApiKeySelected.agid.nodes.sort((a, b) => a.name[0] > b.name[0])
        $scope.availibleNodes = $scope.availibleNodes.sort((a, b) => a.name[0] > b.name[0])
      };


      // Private functions
      $scope.orderByMe = function (x) {
        if ($scope.myOrderBy === x) {
          $scope.rev = !($scope.rev);
        }
        $scope.myOrderBy = x;
      };

      $scope.onSort = function (order) {
        $scope.rev = order;
      };

      function errorCallback(err) {
        console.log('error')
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

    });
