'use strict';
angular.module('VicinityManagerApp.controllers').
  controller('searchUpController', function ($scope, $stateParams, searchService, $window, Notification, configuration) {
    //variables
    $scope.searchResults = []
    $scope.searchText = ''
    $scope.loading = false
    $scope.everythingLoaded = false


    $window.scrollTo(0, 0);

    // $scope.imMobile = Number($window.innerWidth) < 1000;
    // $(window).on('resize',function(){
    //   $scope.imMobile = Number($window.innerWidth) < 1000;
    // });

    // // Clear old search when changing location
    // $scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl){
    //     if (oldUrl.startsWith(configuration.baseHref + "/#/search") && !(newUrl.startsWith(configuration.baseHref + "/#/search"))){
    //       $scope.searchTerm = "";
    //     }
    // });
    $scope.refreshSearch = async function(param){
      // console.log('refreshing search: ' + $scope.searchText)
      if($scope.searchText.length >= 3){
        $scope.searchResults = []
        $scope.loading = true
        const result = await searchService.globalSearch($scope.searchText, undefined, 0)
        $scope.loading = false
        $scope.searchResults = result.data.message
        $scope.everythingLoaded = result.data.message.length < 25
      } else {
        $scope.searchResults = []
      }
      console.log($scope.searchResults)
    }

    $scope.openLargeSearch = function (param) {
      // console.log('opening large search view')
    }
    $(function () {
      // wait till load event fires so all resources are available
        $('.dropdown').on("hidden.bs.dropdown", function(event){
          // clear text when closed
          $scope.searchText = ''
          $scope.searchResults = []
        });
        $('.dropdown').on("shown.bs.dropdown", function(event){
          // set focus on init
          $('#searchInput').focus();
        });
        $('#searchInput').focus(function() {
          if(!$scope.imMobile) {
            $('.dropdown-toggle').dropdown();
          }
        });
    });
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
