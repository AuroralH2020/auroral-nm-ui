'use strict';

angular.module('VicinityManagerApp.controllers')
.controller('dPhistoryController',
function ($scope, $stateParams, commonHelpers, auditAPIService, Notification) {

    // ====== Triggers window resize to avoid bug =======
    commonHelpers.triggerResize();

    $scope.loadedPage = false;
    $scope.noLogs = true;
    $scope.dates = [];
    $scope.logs = [];

    // ====== Sets from which date we retrieve notifications at init =====

    $scope.daysBefore =  7; // Initialized to one week ago
    $scope.period = 'week';

    init();
    function init(){
      $scope.loadedPage = false;
      $scope.dates = [];
      $scope.audits = [];
      auditAPIService.getAll($stateParams.deviceId, $scope.daysBefore)
      .then(function(response){
        try{
          $scope.audits = response.data.message;
          // var myAudits = getAudits(response.data.message);
          $scope.audits.sort(function(a,b){
            return b.created - a.created;
          });
          $scope.audits.forEach(element => {
            var date = new Date(element.created );
            element.timestamp = moment(date);
            element.dateCaption = element.timestamp.format("Do MMM YYYY");
            element.timeCaption = element.timestamp.format("hh:mm a");
            $scope.loadedPage = true;
            if($scope.dates.indexOf(element.dateCaption) === -1)
            $scope.dates.push(element.dateCaption)
          });
          $scope.noLogs = $scope.audits.length !== 0 ? false : true;
          $scope.loadedPage = true;

        }catch(err){
          console.log(err);
          $scope.noLogs = true;
          $scope.loadedPage = true;
          Notification.error("Error processing the logs");
        }
      })
      .catch(function(error){
        console.log(error);
        $scope.noLogs = true;
        $scope.loadedPage = true;
        Notification.error("Server error");
      });
    }

    $scope.notificationsDays = function(period){
      $scope.period = period;
      switch(period){
        case 'today':
          $scope.daysBefore = 1;
          break;
        case 'week':
          $scope.daysBefore = 7;
          break;
        case 'month':
          $scope.daysBefore = 31;
          break;
        case 'Half year':
          $scope.daysBefore = 6 * 31;
          break;
        case 'year':
          $scope.daysBefore = 365;
          break;
      }
      init();
    };

  });
