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
  $scope.newRoles = []

  $('div#myModal1').hide();
  $('div#myModal2').hide();

  $(document).keyup(function(e) {
     if (e.keyCode == 27) {
        $('div#myModal1').hide();
        $('div#myModal2').hide();
    }
  })

  // Initialize & onChange Select2 Elements ==============

  $(".select2").select2({
    allowClear: true,
    closeOnSelect: false
  });

  $(".select2").change(function() {
    $scope.newRoles = ['user'];
    if (this.selectedOptions && this.selectedOptions[0]){
      for(var i = 0; i < this.selectedOptions.length; i++){
        $scope.newRoles.push(this.selectedOptions[i].innerHTML.toString());
      }
    }
  });

  // INITIALIZE
  const init = async function() {
    try {
        // Init roles selector
        $(".select2").val([]).trigger('change'); // Clear selection
        $(".select2").trigger('change');
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

  function resetModal() {
    $scope.emailUser = ""
    $scope.nameUser = ""
    $scope.emailCompany = ""
    $scope.nameCompany = ""
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
    resetModal()
    $('div#myModal1').hide();
  };

  $scope.closeNow2 = function () {
    resetModal()
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
        resetModal()
        $('div#myModal2').hide()
      } catch (err) {
        resetModal()
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
          roles: $scope.newRoles,
          type: "newUser"
        };
      try {
        await invitationsAPIService.postOne(data)
        resetModal()
        $('div#myModal1').hide();
      } catch (err) {
        resetModal()
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
