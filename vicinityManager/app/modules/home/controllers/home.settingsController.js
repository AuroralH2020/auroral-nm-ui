'use strict';
angular.module('VicinityManagerApp.controllers')
.controller('settingsController',
function ($scope, commonHelpers, tokenDecoder, invitationsAPIService, Notification) {

  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  // SERVER INFO
  $scope.imAdmin = false;
  // $scope.organisation = {};
  // $scope.user = {};

  // FORM FIELDS
  $scope.emailUser = ""
  $scope.nameUser = ""
  $scope.emailCompany = ""
  $scope.nameCompany = ""

  $('div#myModal1').hide();
  $('div#myModal2').hide();

  $(document).keyup(function(e) {
     if (e.keyCode == 27) {
        $('div#myModal1').hide();
        $('div#myModal2').hide();
    }
  })

  // INITIALIZE
  const init = async function() {
    try {
        // $scope.organisation =  (await userAccountAPIService.getUserAccountProfile($window.sessionStorage.companyAccountId)).data.message
        // $scope.user = (await userAPIService.getUser($window.sessionStorage.userAccountId)).data.message
        getToken()
    } catch (error) {
      console.log(error)
        Notification.error('Issue loading invitations')
    }
  }

  function getToken() {
    const payload = tokenDecoder.deToken()
    const rolesArr = payload.roles.split(',')
    for (var i in rolesArr) {
      if (rolesArr[i] === 'administrator') {
        $scope.imAdmin = true
      }
    }
  }

  init()

  // END INITIALIZE

  $scope.alertPopUp1 = function () {
    $('div#myModal1').show();
  };

  $scope.alertPopUp2 = function () {
    $('div#myModal2').show();
  };

  $scope.closeNow1 = function () {
    $('div#myModal1').hide();
  };

  $scope.closeNow2 = function () {
    $('div#myModal2').hide();
  };

  $scope.inviteCompany = async function (validBool2) {
    if (validBool2){
      var data = {
          emailTo: $scope.emailCompany,
          nameTo: $scope.nameCompany,
          type: "newCompany"
        };
      try {
        await invitationsAPIService.postOne(data)
        $('div#myModal2').hide()
      } catch (err) {
        console.log(err);
        Notification.error("Error inviting company")
      }
    } else {
      $('input#emailVer2').addClass("invalid");
      setTimeout(function() {
        $('input#emailVer2').removeClass("invalid");
      }, 2000)
    }
  }

  $scope.inviteUser = async function (validBool) {
    if (validBool) {
      var data = {
          emailTo: $scope.emailUser,
          nameTo: $scope.nameUser,
          type: "newUser"
        };
      try {
        await invitationsAPIService.postOne(data)
        $('div#myModal1').hide();
      } catch (err) {
        console.log(err);
        Notification.error("Error inviting user");
      }
    } else {
      $('input#emailVer').addClass("invalid");
      setTimeout(function() {
        $('input#emailVer').removeClass("invalid");
      }, 2000)
    }
  }

});
