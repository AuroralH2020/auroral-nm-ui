'use strict'

angular.module('Registration')

  .controller('registrationNewUserController',
             ['$scope', '$rootScope', '$location', 'configuration', '$state', '$window', '$stateParams', 'invitationsAPIService', 'registrationsAPIService', 'userAccountAPIService', 'AuthenticationService', 'Notification',
             function ($scope, $rootScope, $location, configuration, $state, $window, $stateParams, invitationsAPIService, registrationsAPIService, userAccountAPIService, AuthenticationService, Notification){
               //rest login status
              //  AuthenticationService.ClearCredentials();

               $scope.isError = false;
               $scope.visib = 'visible';
               $scope.visib2 = 'hidden';
               $scope.showPass = "password";
               $scope.newRegisHide = true;
               $scope.newRegis = false;
               $scope.newComp = false;
               $scope.newUser = false;
               $scope.newRegis2 = false;
               $scope.comps = [];
               $scope.number = 1;
               $scope.note ="Register new member";
               $scope.note2 = "Registration form";
               $scope.companyName = "";
               $scope.registration = {};
               $scope.baseHref = configuration.baseHref + '/#/login';


// ===== Update status to verified =======
   var myInit = function(){
      registrationsAPIService.putOne($stateParams.registrationId, {status: "verified"}).then(
      function successCallback(){},
      function errorCallback(){
        Notification.error("Verification failed");
      });
   };

  myInit();

}]);
