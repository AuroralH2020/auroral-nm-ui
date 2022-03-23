"use strict";
angular.module('VicinityManagerApp.controllers')
  .controller('companyProfileController',
    function($rootScope, $scope, $window, commonHelpers, imageHelpers, $state, $stateParams, $location, $cookies, userAccountAPIService, contractAPIService, tokenDecoder, AuthenticationService, Notification, configuration) {

      // ====== Triggers window resize to avoid bug =======
      commonHelpers.triggerResize();

      $scope.locationPrefix = $location.path();

      $scope.isMyProfile = true;
      $scope.imAdmin = false;
      $scope.canSendNeighbourRequest = false;
      $scope.canCancelNeighbourRequest = false;
      $scope.canAnswerNeighbourRequest = false;
      $scope.isNeighbour = false;
      $scope.friends = [];
      $scope.users = [];
      $scope.devices = 0;
      $scope.services = 0;
      $scope.loaded = false;
      $scope.showInput = false;
      // modal
      $scope.modalText = "";
      $scope.askedFunction

      // Initializa DOM elements
      $('a#loc2').show();
      $('p#loc1').show();
      $('a#loc4').hide();
      $('a#loc5').hide();
      $('input#loc3').hide();
      $('a#not2').show();
      $('p#not1').show();
      $('a#not4').hide();
      $('a#not5').hide();
      $('textarea#not3').hide();

      // Get resources & data ================
      $scope.myInit = async function() {
        try {
            const organisation =  await userAccountAPIService.getUserAccountProfile($stateParams.companyAccountId)
            updateScopeAttributes(organisation)
            $scope.loaded = true;
            // var itemCount = await itemsAPIService.itemsCount('organisation');
            $scope.devices = 0; // Number(response.data.message.devices);
            $scope.services = 0; // Number(response.data.message.services);
            // Check if it is the company profile and if the user is its admin
            $scope.isMyProfile = ($window.sessionStorage.companyAccountId === $stateParams.companyAccountId);
            var payload = tokenDecoder.deToken();
            var keyword = new RegExp('administrator');
            $scope.imAdmin = ($scope.isMyProfile && keyword.test(payload.roles));
        } catch (error) {
            errorCallback(error);
        }
      };

      $scope.myInit();

      // Functions Neighbours ==================

      $scope.sendNeighbourRequest = function() {
        userAccountAPIService.sendNeighbourRequest($stateParams.companyAccountId)
          .then(function(response) {
            Notification.success("Partnership request sent!");
            onlyRefreshAccount();
          })
          .catch(errorCallback);
      };

      $scope.acceptNeighbourRequest = function() {
        userAccountAPIService.acceptNeighbourRequest($stateParams.companyAccountId)
          .then(function(response) {
            Notification.success("Partnership request accepted!");
            onlyRefreshAccount();
          })
          .catch(errorCallback);
      };

      $scope.rejectNeighbourRequest = function() {
        userAccountAPIService.rejectNeighbourRequest($stateParams.companyAccountId)
          .then(function(response) {
            Notification.success("Partnership request rejected!");
            onlyRefreshAccount();
          })
          .catch(errorCallback);
      };

      $scope.cancelNeighbourRequest = function() {
        userAccountAPIService.cancelNeighbourRequest($stateParams.companyAccountId)
          .then(function(response) {
            Notification.success("Partnership request canceled!");
            onlyRefreshAccount();
          })
          .catch(errorCallback);
      };
      $scope.sendContractRequest = function() {
        contractAPIService.createContract([$stateParams.companyAccountId])
          .then(function(response) {
            Notification.success("Contract request sent!");
            onlyRefreshAccount();
          })
          .catch(errorCallback);
      };
      

      $scope.cancelNeighbourship = function() {
        $scope.testFunction('Are you sure? May affect existing contracts.', async function () {
          userAccountAPIService.cancelNeighbourship($stateParams.companyAccountId)
            .then(function(response) {
              Notification.success("Partnership canceled!");
              onlyRefreshAccount();
            })
            .catch(errorCallback);
        })
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
          $('div#keymodal').show();
      };
      $scope.modalOk = async function(){
        $('div#keymodal').hide();
        await $scope.askedFunction()
      }
      $scope.modalCancel = function(){
        $('div#keymodal').hide();
      } 

      // Refresh $scope =================

      function onlyRefreshAccount() {
        userAccountAPIService.getUserAccountProfile($stateParams.companyAccountId)
          .then(function(response) {
            updateScopeAttributes(response);
          })
          .catch(errorCallback);
      };

      function updateScopeAttributes(response) {
        $scope.name = response.data.message.name;
        $scope.avatar = response.data.message.avatar || configuration.avatarOrg;
        $scope.companyAccountId = response.data.message.cid;
        $scope.location = response.data.message.location;
        $scope.notes = response.data.message.notes;
        $scope.contracted = response.data.message.contracted;
        $scope.contractRequested = response.data.message.contractRequested;
        $scope.ctid = response.data.message.ctid;
        // $scope.bid = response.data.message.businessId;
        $scope.canSendNeighbourRequest = response.data.message.canSendNeighbourRequest;
        $scope.canCancelNeighbourRequest = response.data.message.canCancelNeighbourRequest;
        $scope.canAnswerNeighbourRequest = response.data.message.canAnswerNeighbourRequest;
        $scope.isNeighbour = response.data.message.isNeighbour;
        $scope.friends = response.data.message.knows;
        $scope.users = response.data.message.hasUsers;
      }

      // Edit Profile Functions ===============

      $scope.locEdit = function() {
        $('a#loc2').hide();
        $('p#loc1').hide();
        $('a#loc4').show();
        $('a#loc5').show();
        $scope.locationNew = $scope.location;
        $('input#loc3').show();
      };

      $scope.locCancel = function() {
        $scope.locationNew = "";
        $('a#loc2').show();
        $('p#loc1').show();
        $('a#loc4').hide();
        $('a#loc5').hide();
        $('input#loc3').hide();
      };

      $scope.locSave = function() {
        var data = {
          location: $scope.locationNew
        };
        $scope.updateCompany(data);
        $('a#loc2').show();
        $('p#loc1').show();
        $('a#loc4').hide();
        $('a#loc5').hide();
        $('input#loc3').hide();
        $scope.locationNew = "";
      };

      $scope.notEdit = function() {
        $('a#not2').hide();
        $('p#not1').hide();
        $('a#not4').show();
        $('a#not5').show();
        $scope.notesNew = $scope.notes;
        $('textarea#not3').show();
      };

      $scope.notCancel = function() {
        $scope.notesNew = "";
        $('a#not2').show();
        $('p#not1').show();
        $('a#not4').hide();
        $('a#not5').hide();
        $('textarea#not3').hide();
      };

      $scope.notSave = function() {
        var data = {
          notes: $scope.notesNew
        };
        $scope.updateCompany(data);
        $('a#not2').show();
        $('p#not1').show();
        $('a#not4').hide();
        $('a#not5').hide();
        $('textarea#not3').hide();
        $scope.notesNew = "";
      };

      $("select#editThemeColor").change(function() {
        $rootScope.skinColor = $('select#editThemeColor').val();
        userAccountAPIService.updateUserAccounts($window.sessionStorage.companyAccountId, {
            skinColor: $rootScope.skinColor
          })
          .then(
            function(response) {
              $rootScope.styles = ['hold-transition', 'skin-' + $rootScope.skinColor, 'sidebar-mini'];
              $rootScope.myColor = 'my-' + $rootScope.skinColor;
              $rootScope.bckColor = 'bck-' + $rootScope.skinColor;
              Notification.success('Configuration successfully updated!');
            })
          .catch(errorCallback);
      });

      $scope.updateCompany = function(data) {
        userAccountAPIService.updateUserAccounts($window.sessionStorage.companyAccountId, data)
          .then(
            function(response) {
              onlyRefreshAccount();
            })
          .catch(errorCallback);
      };

      $scope.removeOrg = async function() {
        $scope.testFunction('Are you sure? May affect existing contracts.', async function () {
          try {
            await userAccountAPIService.removeOrganisation()
            Notification.success('Organisation successfully removed!')
            $cookies.remove("r_12fg"); // If log out remove rememberMe cookie
            AuthenticationService.signout()
          } catch (err) {
            console.log(err)
            Notification.error('Problem removing organisation, contact with the admins')
          }
        })
      }

      // Avatar change functions ==============

      var base64String = "";

      $("input#input1").on('change', function(evt) {
        var tgt = evt.target || window.event.srcElement,
          files = tgt.files;
          var img = new Image;
          img.src = URL.createObjectURL(tgt.files[0]);
          img.onload = function() {
            base64String = imageHelpers.resizeImage(img, 120, 120, 0); //HERE IS WHERE THE FUNCTION RESIZE IS CALLED!!!!
            $("img#pic").prop("src", base64String);
          }
      });

      $scope.showLoadPic = function() {
        $scope.showInput = true;
        $('#editCancel1').fadeIn('slow');
        $('#editUpload2').fadeIn('slow');
        $('#input1').fadeIn('slow');
      };

      $scope.cancelLoadPic = function() {
        $('#editCancel1').fadeOut('slow');
        $('#editUpload2').fadeOut('slow');
        $('#input1').fadeOut('slow');
        $('img#pic').fadeOut('slow');
        setTimeout(function() {
          $("img#pic").prop("src", $scope.avatar);
          $('img#pic').fadeIn('slow');
        }, 600);
      };

      $scope.uploadPic = function() {
        userAccountAPIService.updateUserAccounts($window.sessionStorage.companyAccountId, {
            avatar: base64String
          })
          .then(
            function(response) {
              $scope.avatar = response.config.data.avatar;
              $rootScope.$broadcast('refreshOrganisationAvatar', {avatar: $scope.avatar});
              $('#editCancel1').fadeOut('slow');
              $('#editUpload2').fadeOut('slow');
              $('#input1').fadeOut('slow');
              $('img#pic').fadeOut('slow');
              setTimeout(function() {
                $("img#pic").prop("src", $scope.avatar);
                $('img#pic').fadeIn('slow');
              }, 600);
            })
          .catch(errorCallback);
      };

      function errorCallback(err) {
        if (err.status === 404) {
          console.log(err);
          Notification.error("Company not found");
          $state.go("root.main.allEntities");
        } else if(err.status < 500) {
          console.log(err);
          Notification.error(err.data.error);
        }
        else{
          console.log(err);
          Notification.error("Server error");
        }
      }

  });
