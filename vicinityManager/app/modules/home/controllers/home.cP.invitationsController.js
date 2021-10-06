'use strict';
angular.module('VicinityManagerApp.controllers')
.controller('cPinvitationsController',
function ($scope, $stateParams, commonHelpers, invitationsAPIService, Notification, configuration) {
  // ====== Triggers window resize to avoid bug =======
  commonHelpers.triggerResize();

  $scope.invitations = [];
  $scope.companyId = $stateParams.companyAccountId
  $scope.loaded = false
  $scope.noInvitations = false
  $scope.rev = false // Initial sorting set to alphabetical
  $scope.sortColumn = 'updated'

  // Initialize

  const init = async () => {
    try {
      const response = await invitationsAPIService.getAll()
      $scope.invitations = response.data.message.map((it) => {
        return {
          id: it.invitationId,
          emailTo: it.emailTo, // Invited person mail
          nameTo: it.nameTo, // Invited company name or person name
          roles: it.roles, // Mandatory when creating a new User
          sentByEmail: it.sentBy.email,
          sentByUid: it.sentBy.uid,
          used: it.used,
          status: it.status,
          updated: moment(new Date(it.updated)).format("Do MMM YYYY"),
          created: it.created
        }
      })
      $scope.loaded = true
      $scope.noUsers = $scope.invitations.length === 0 ? true : false
    } catch (err) {
      console.log(err)
      $scope.loaded = true
      Notification.error("Server error")
    }
  }
  
  init()

  // Functions
  $scope.resendInvitation = function(){
    alert('Resend Not Implemented')
  }

  $scope.cancelInvitation = function(){
    alert('Cancel Not Implemented')
  }

  $scope.onSort = function(sortBy){
    $scope.rev = !$scope.rev
    $scope.sortColumn = sortBy
  }

});
